
import express from "express"
import dotenv from "dotenv"
import db from "./DB/seed.js"
import { __dirname } from "./relativePath.js"
import tasnifJson, { locationJson } from "./utils/readExcel.js"
import findBestMatch from "./utils/bestAnswer.js";
import cors from "cors"
import { createWorker } from "tesseract.js";
import { currentChatHistory } from "./utils/currentChats.js";
import { closestAnswersForSystemInfo } from "./utils/systemInfoAnswers.js";
import { generateAiResponse } from "./utils/generateResponseContent.js";
import { createMessage } from "./utils/createNewMessage.js";
import { searchKnowledgeBase } from "./utils/searchKnowledgeBase.js";
import { createNewConversation } from "./utils/newConversation.js";
import { getDetailedDataForQuestion } from "./utils/detailedData.js";
import pingRouter from "./routes/ping.js"

// routes

dotenv.config()
const app = express()

const baseUrl =  process.env.BASE_URL
// middlewares
app.use(cors({
  origin: [baseUrl, 'http://localhost:5173'],
  credentials: true,
  methods  : 'GET, POST, PUT, PATCH, DELETE'
}))

app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.use('/ping', pingRouter)
const wakeupTime = 13 * 60 * 1000

process.env.Env === 'production' && setInterval(async() => {
await wakeUp()  
}, wakeupTime);

async function wakeUp(){
  try {
    const res = await fetch(`${baseUrl}/ping`)
    console.log(res.status, 'wake up rendr !')
  } catch (err) {
    console.log('error waking up ping server', err)
  }
}

app.post('/api/submitQuestion', async(req,res)=>{
let cleanAnswer;
    const {question} = req.body.questionData
    const {selectedLang} = req.body.questionData
    let conversation_id = parseInt(req.query.conversation_id)
     
    const codes = [...tasnifJson, ...locationJson]

    createMessage(conversation_id, 'user', question)    
      
    //  const tasnifCodes = findBestMatch(question, tasnifJson)
     const paymentCodes = findBestMatch(question, codes)

  const sources = {
    relevantInfo: searchKnowledgeBase(question),  // Array of error objects
    systemInfoAnswers: closestAnswersForSystemInfo(question),  // Array of system process objects  
    possibleCodeAnswer :  paymentCodes,
    conversation : currentChatHistory(conversation_id), 
    knowledgeBase : await getDetailedDataForQuestion()
  };

      const aiResponse = 
      await generateAiResponse(question,selectedLang,
        sources.relevantInfo,
        sources.systemInfoAnswers, 
        sources.possibleCodeAnswer,
      sources.conversation)

// 
     cleanAnswer = aiResponse
    // return console.log(cleanAnswer, ' the')
      createMessage(conversation_id, 'AI', cleanAnswer)
     console.log('ai answer = ', cleanAnswer)

     if(cleanAnswer === null || cleanAnswer === undefined){
         cleanAnswer = await generateAiResponse(question,selectedLang,
          sources.relevantInfo,
          sources.systemInfoAnswers, 
          sources.possibleCodeAnswer,
          sources.conversation)
     }

    return res.json({
        success : true,
        answer :  cleanAnswer,
        lang : selectedLang,
        conversationId : conversation_id
    })
  
})

// new conversation
app.post('/api/newConversation', (req, res)=>{
  const {title} = req.body
  const newConversation = createNewConversation(title)
  res.json({
    success : true,
    conversationId  : newConversation.lastInsertRowid
  })
})

// scanning file upload

app.post('/api/upload/doc', async(req,res)=>{

  const {file} = req.body

console.log('comming file')
  if(!file) return res.json({message : 'invalid or unknown file'})

    const worker = await createWorker('eng+fas+ara');

  
  // Optimize for mixed RTL/LTR text
  await worker.setParameters({
    tessedit_pageseg_mode: '3', // Auto page segmentation
    preserve_interword_spaces: '1',
    tessedit_ocr_engine_mode: '3', // Default OCR engine
  });
  
  // THE BELOW TAKES THE text OUT OF response.data object
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();

  const cleanText = Buffer.from(text, 'binary').toString('utf8'); // Rarely needed
  // console.log(cleanText, 'clean text')

  res.json({
    success : true,
    parsedText : text,
    message : 'success parse'
  })
})

// all messages of a conversation
app.get('/api/conversation/:id/messages', async(req,res)=>{
   const conversationId = parseInt(req.params.id)
 console.log('the issue is : ',conversationId)

   const existingConversation =db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId)

   console.log(existingConversation, 'existing conversation')

   if(!existingConversation) return console.log('existing conversation not found')

    const messages = 
    db.prepare('SELECT * FROM messages WHERE conversation_id = ?').all(conversationId)

    if(!messages) console.log('no message found')

    return res.json({
      success : true,
      messages : messages
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, async()=>{
    console.log('now running on port 3001')
})