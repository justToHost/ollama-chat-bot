
import express from "express"
import axios, { all } from "axios"
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

dotenv.config()
const app = express()
app.use(express.json())

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// we add converstion id to have track of first message and converstions

app.post('/api/submitQuestion', async(req,res)=>{

    const {question} = req.body.questionData
    let {conversation_id} = req.query

     console.log(conversation_id, 'id')

        // step 1 detect language of question
    const askedLang = await detectLanguage(question)
      
     const relevantInfo = searchKnowledgeBase(question)

     console.log(relevantInfo, 'releveant info')

     const knowledgeBase = await getDetailedDataForQuestion()

      const aiResponse = 
      await generateAiResponse(question,askedLang,relevantInfo, knowledgeBase, conversation_id)


    const cleanAnswer = aiResponse
      createMessage(conversation_id, 'AI', cleanAnswer)

       console.log('ai answer = ', cleanAnswer)

    res.json({
        success : true,
        answer :  cleanAnswer,
        lang : askedLang,
        conversationId : conversation_id
    })
  
})



   // Simple filter example (expand this)
// function filterRows(question, allRows) {
//   const questionWords = question.toLowerCase().split(' ');
//   return allRows.filter(row => 
//     questionWords.some(word => 
//       row.District.includes(word) || 
//       row['Description in English'].toLowerCase().includes(word)
//     )
//   ).slice(0, 5); // Take only first 5 matches
// }


async function generateAiResponse(question, askedLang, relevantInfo, knowledgeBase, conversationId){
     const concatenated = [...tasnifJson, ...locationJson]

  try {

     const currentConversationMessages = 
     db.prepare(`
      SELECT content from messages WHERE conversation_id = ?`)
      .all(conversationId)

       console.log('all current conversation messages ', 
        currentConversationMessages)

    const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
   input : `You are a payroll system expert for Afghanistan Ministry of Finance.

    USER QUESTION: "${question}"

    think BUT do not include in the output :
    1. 5 different ways a user might ask this same question (in ${askedLang})
    2. Key technical terms and their synonyms
    3. Common misspellings or alternative phrasings

    
    AVAILABLE KNOWLEDGE BASE (JSON array):
    ${JSON.stringify(relevantInfo, null, 2)}

    INSTRUCTIONS:
    1. FIRST, filter the knowledge base to find entries MOST RELEVANT to the user's question
    2. RELEVANCE CRITERIA:
      - Entry's "question_dari" field should contain keywords from user's question
      - Entry's "tags" array should contain words from user's question  
      - Entry's "user_friendly_title" should be similar to user's question

    3. If NO entries match the criteria, look on this knowledge base : 
    ${knowledgeBase} and if still not match found then

    answer the question considering the prevous chats as follow if any  : 
    ${JSON.stringify(currentConversationMessages, null, 2)} (JSON ARRAY)
    
    respond: "I don't have specific information about this issue. Please contact the relevant department."
    4. If MULTIPLE entries match, choose the ONE with highest relevance score
    5. ANSWER ONLY in Dari, using simple, non-technical language
    6. Base your answer STRICTLY on the "answer" or "simple_explanation" fields from selected entry
    7. Structure response: Problem → Solution → Who to contact
    8: if the question was about tasneef and location codes 
    USE the ${concatenated} data. for example "what is the code for Dushi district of Baghlan province " its 0903
    or in persian it might be "کود ولسوالی دوشی ولایت بغلان چی است" or "تمام کودهای مربوط ولایت بغلان را بده " 

    or "what is the tasneef code for civilian permanent employees ? " "its 21100". 
    "which codes can belong to employees enrolled in ministry of education ? " and u provide all the mentioned ones
    according to the given structured data. 

    
    AND for information 

    EXAMPLE:
    "question_dari": "معاش ایجاد شده از حالت اپروف به ایجاد نمی آید؟"
    "answer": "الف: حذف ام 41 و ام 16 باید حذف باشند بعدا کوشش شود."
  "user_friendly_title": "معاش ایجاد شده از حالت اپروف به ایجاد نمی آید؟"
    "simple_explanation": "الف: حذف ام 41 و ام 16 باید حذف باشند بعدا کوشش شود

    NOW, answer the user's question based on the knowledge base above: 

    RESPONSE REQUIREMENTS:

    - Answer strictly based ONLY on the provided context and previous conversation flow.
    - If the question is irrelevant to payroll, accounting, or ministry financial matters and unrelated to previous discussions, respond: "I'm sorry, I don't have information about that." in the same language as the question.


    Exception:
    - Respond appropriately to greetings or gratitude.
    - Answer follow-up questions related to previous discussions based on your knowledge.

`});

    const simplifiedAnswer = response.output_text

     const  targetLanguageAnswer = await 
     translateText(simplifiedAnswer, askedLang)

       console.log(targetLanguageAnswer, ' the answer')

     const cleanAnswer = targetLanguageAnswer
        .replace(/\*\*/g, '')  // Remove bold markers
        .replace(/\*/g, '')    // Remove italic markers  
        .replace(/\n\s*\n/g, '\n\n') // Clean multiple newlines
        .trim();

        console.log(cleanAnswer, 'the clean answer ')
        return cleanAnswer

    }catch(err){
      console.log(err)
      throw err
    }

}

function createMessage(conversationId, role, content){

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

async function detectLanguage(question) {
  
    console.log(question, 'question ')
  const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,

    input: ` you are a master class translator and at the same time you are extremely good at slang and ususal language in persian and pashto languages,  
    give me the exact language of this ${question}
     return just the name of the language. 
     Ex : "pasho" or "dari" or "persian" `
});

return response.output_text
}

 async function translateText(askedText, targetLang) {  
  const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
    input: `Translate this "${askedText}" to "${targetLang} 
    only if text is in other than english , 
    otherwise give it as is without revealing it is in english`
});

 console.log('translated text ',response.output_text)

        return response.output_text
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

app.listen(3001, ()=>{
    console.log('now running on port 3001')
})