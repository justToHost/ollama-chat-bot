
import express from "express"
import dotenv from "dotenv"
import OpenAI from "openai"
import fs from "fs/promises"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {PDFParse} = require('pdf-parse');
import path from "path"
import Tesseract from "tesseract.js"
import paymentSystemTrainingData from "./trainedData.js"
import db from "./DB/seed.js"
import { __dirname } from "./relativePath.js"
import tasnifJson, { locationJson } from "./utils/readExcel.js"
import { systemInfo } from "./systemInfo.js";
import findBestMatch from "./utils/bestAnswer.js";
import {franc} from "franc"
import cors from "cors"


dotenv.config()

let currentModel = 'openai/gpt-oss-20b' || 'openai/gpt-4o' || 'ofOllamaONE'



const app = express()

app.use(cors({
  origin: ['ollama-chat-bot.vercel.app', 'http://localhost:5173']
}))


app.use(express.json())

const client = new OpenAI({
    apiKey: process.env.OPEN_ROUTER_API,
    baseURL: 'https://openrouter.ai/api/v1' || "https://api.groq.com/openai/v1"
});


function currentChatHistory(conversationId){
  const currentConversationMessages = 
     db.prepare(`
      SELECT content from messages WHERE conversation_id = ?`)
      .all(conversationId)

      return currentConversationMessages
}
        
     
app.post('/api/submitQuestion', async(req,res)=>{

    const {question} = req.body.questionData
    let conversation_id = parseInt(req.query.conversation_id)
    const codes = [...tasnifJson, ...locationJson]


    createMessage(conversation_id, 'user', question)
      // Use franc for accurate detection
       const freeLang = franc(question, {minLength: 1})

        // step 1 detect language of question
    const askedLang = freeLang ? freeLang : await translateText(question)
      
     const bestMatchTasnifCode = 
     findBestMatch(tasnifJson, locationJson, question)

  const sources = {
    relevantInfo: searchKnowledgeBase(question),  // Array of error objects
    systemInfoAnswers: closestAnswersForSystemInfo(question),  // Array of system process objects  
    possibleCodeAnswer :  bestMatchTasnifCode,
    conversation : currentChatHistory(conversation_id), 
    knowledgeBase : await getDetailedDataForQuestion()
  };

      const aiResponse = 
      await generateAiResponse(question,askedLang,
        sources.relevantInfo,
        sources.systemInfoAnswers, 
        sources.possibleCodeAnswer,
      sources.conversation)

// 
    const cleanAnswer = aiResponse
    // return console.log(cleanAnswer, ' the')
      createMessage(conversation_id, 'AI', cleanAnswer)

       console.log('ai answer = ', cleanAnswer)

    res.json({
        success : true,
        answer :  cleanAnswer,
        lang : askedLang,
        conversationId : conversation_id
    })
  
})


async function useAiWith(model,role, content) {
  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      {
        role: role,
        content: content,
      },
    ],
  });
   const answer = completion?.choices?.[0]?.message?.content;
    
    if (!answer) {
      console.log('ai threw error ! ',  answer);
      throw new Error('AI returned empty response');
    }
  console.log('the message ',  answer);
  return answer
}

function closestAnswersForSystemInfo(question){
  const questionWords =  question.toLowerCase().split(' ')

 return systemInfo.filter(info => {
  const searchTerms = question.toLowerCase().split(' ');
  
  return info.key_points.some(point => {
    const pointLower = point.toLowerCase();
    return searchTerms.some(term => 
      pointLower.includes(term) ||
      info.title_dari.toLowerCase().includes(term) ||
      info.title_english.toLowerCase().includes(term)
    );
  });
}).slice(0,3)
}


const generateResponseContent = 
(question,relevantInfo,systemInfoAnswers,
  possibleCodeAnswer,conversation, askedLang)=>{
return `You are a payroll system expert for Ministry of Finance.

USER QUESTION: "${question}"

ANSWER STRICTLY BASED ON THESE INFORMATIONS WITH NO SELF INFO: in this ${askedLang} language.

1. ERROR/ISSUE DATABASE (for problems, errors, troubleshooting):
${JSON.stringify(relevantInfo, null, 2)}

2. SYSTEM/MENU DATABASE (for "where is...", "how to access...", "location of..."):
${JSON.stringify(systemInfoAnswers, null, 2)}

3. CODE/LOCATION DATABASE (for codes, tasneef, districts, provinces): if three options check the question and the choose the best possible one otherwise say not found 
   
${JSON.stringify(possibleCodeAnswer, null, 2)}


4: PREVOUS CHAT HISTORY: ${JSON.stringify(conversation, null, 2)}

5: also just quickly check if the language of the asked question
 and the context is the same

INSTRUCTIONS:


1. CLASSIFY the question type:
   - Type A: Error/Problem (e.g., "چرا معاش دانلود نمیشه؟", "error during save")
   - Type B: System Navigation (e.g., "کجا امتیازات کارکن است؟", "where to create department")
   - Type C: Codes/Locations (e.g., "کود دوشی چیست؟", "tasneef code for civilian")
   - Type D: General/Other

2. USE THE CORRECT SOURCE:
   - Type A → Search ERROR DATABASE
   - Type B → Search SYSTEM/MENU DATABASE  
   - Type C → Search CODE/LOCATION DATABASE
   - Type D → Search GENERAL KNOWLEDGE

3. SEARCH CRITERIA:
   For Type A: Match with "question_dari", "tags", "error_signature"
   For Type B: Match with "title_dari", "key_points", "workflow"  
   For Type C: Match exact code names/numbers
   For Type D: Broad search in all sources

4. IF NO MATCH in primary source, check OTHER sources.

5. RESPONSE FORMAT (in Dari):
   - If Type A: Problem → Solution → Who to contact
   - If Type B: Location → Steps → Notes
   - If Type C: Code → Description → Related codes
   - If Type D: Simple explanation

EXAMPLE CLASSIFICATIONS:
- "معاش ایجاد شده از حالت اپروف به ایجاد نمی آید؟" → Type A (Error)
- "امتیازات کارکن کجاست؟" → Type B (System Navigation)  
- "کود ولسوالی دوشی چیست؟" → Type C (Codes)
- "مراحل ثبت کارمند چیست؟" → Type B (System Navigation)

EXCEPTION : if any completely irrelevant question asked response repectly that u do not have infomation


NOW ANSWER:`
}



async function generateAiResponse(question, askedLang, 
  relevantInfo, 
  systemInfoAnswers, 
  possibleCodeAnswer,
  conversation){

    const content = 
    generateResponseContent(
      question, 
      relevantInfo,
      systemInfoAnswers,
      possibleCodeAnswer,
      conversation,
      askedLang )
    
    try{
      const result = await useAiWith(currentModel, 'user', content)

      console.log(result, 'result of the anaswer generation')

      return result;
    }catch(err){
      console.log(err)
      throw err
    }
}

function createMessage(conversationId, role, content){

   console.log(conversationId, role, content, 'new conversation')
 try{
   const message = db.prepare(`INSERT INTO messages 
    (conversation_id,role,content)
     VALUES(?, ? , ?)
    `).run(conversationId,role,content)

    return message

 }catch(err){
  console.log(err)
  throw err
 }

}

function searchKnowledgeBase(q){
  const words = q.split(' ').filter(w => w.length > 1);
  const query = q.toLowerCase();
  
  const scoredResults = paymentSystemTrainingData.map(data => {
    let score = 0;
    
    // Check each word
    words.forEach(word => {
      if (data.question_dari?.includes(word)) score += 3;
      if (data.tags?.some(tag => tag.includes(word))) score += 2;
      if (data.user_friendly_title?.includes(word)) score += 2;
      if (data.question_english?.includes(word)) score += 1;
      if (data.error_signature?.includes(word)) score += 1;
    });
    
    // Exact matches get bonus
    if (data.question_dari?.includes(query)) score += 5;
    
    return { ...data, score };
  })
  .filter(item => item.score > 1) // Only items with some match
  .sort((a, b) => b.score - a.score) // Highest score first
  .slice(0, 3); // Top 3 matches
  
  return scoredResults;
}

 async function translateText(askedText) {  

   const content = ` you are a master class translator and at the same time you are extremely good at slang and ususal language in persian and pashto languages,  
    give me the exact language of this ${askedText}
     return just the name of the language. 
     Ex : "pasho" or "dari" or "persian" `

      const textLang = await useAiWith(currentModel, 'user', content)

    
      return textLang 
}



async function getDetailedDataForQuestion() {
  const fileBuffered = await fs.readFile(path.join(__dirname, '/pdfFiles/tpms.pdf'))
console.log(fileBuffered, 'buffer of pdf file')
const parser = new PDFParse({ data: fileBuffered }); // Use 'data' not 'url'

const text = await parser.getText()
  return text;

}


function createNewConversation(title){
 try{
   db.prepare('BEGIN').run()

  // new conversation
  const newConversation = db.prepare(`INSERT INTO conversations (title)
    VALUES(?)`)

    const info = newConversation.run(title)
    console.log(newConversation.columns.length, 'new one')

     db.prepare('COMMIT').run()

     const convs = db.prepare('SELECT * FROM conversations').all()

     console.log('all conversations ', convs)
     return info
 }catch(err){
  console.log(err)
      db.prepare('ROLLBACK')
      throw err
 }
}


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

  const result = await Tesseract.recognize(
    file,
    'eng',
    {
    logger: m => console.log(m), // Keep logger for debugging
    // Use CDN to avoid local file issues
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/',
  }
  );
  
  const text = result.data.text
  // // return console.log(text)
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
app.listen(PORT, ()=>{
    console.log('now running on port 3001')
})