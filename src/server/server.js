
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

dotenv.config()
const app = express()
app.use(express.json())

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});


function currentChatHistory(){
  const currentConversationMessages = 
     db.prepare(`
      SELECT content from messages WHERE conversation_id = ?`)
      .all(conversationId)

      return currentConversationMessages
}
        
     
app.post('/api/submitQuestion', async(req,res)=>{

    const {question} = req.body.questionData
    let {conversation_id} = req.query

    //  console.log(conversation_id, 'id')

     const bestMatchTasnifCode = findBestMatch(tasnifJson, question)

     return console.log('best match for tasnieef ', bestMatchTasnifCode)

        // step 1 detect language of question
    const askedLang = await detectLanguage(question)
      
    // console.log('typfe of taneef ', typeof tasnifJson, tasnifJson)
   console.log('typfe of location ', typeof locationJson, tasnifJson)
  const sources = {
    relevantInfo: searchKnowledgeBase(question),  // Array of error objects
    systemInfoAnswers: closestAnswersForSystemInfo(question),  // Array of system process objects  
    possibleCodeAnswer : [...tasnifJson, ...locationJson],
    conversation : currentChatHistory, 
    knowledgeBase : await getDetailedDataForQuestion()
  };


      

      const aiResponse = 
      await generateAiResponse(question,askedLang,
        sources.relevantInfo, 
        sources.possibleCodeAnswer,
      sources.conversation)

// 
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

// // Example usage with different question formats:
// function handleTasnifQuestion(question, tasnifCodes) {
//   const results = searchInTasnifCodes(question, tasnifCodes);
  
//   // Format the response
//   if (results.exactMatches.length > 0) {
//     const bestMatch = results.exactMatches[0];
//     return {
//       type: 'exact_match',
//       answer: `کود ${bestMatch.code}: ${bestMatch.dariDescription}`,
//       allMatches: results.exactMatches.slice(0, 5).map(m => ({
//         code: m.code,
//         description: m.dariDescription
//       }))
//     };
//   } else if (results.partialMatches.length > 0) {
//     return {
//       type: 'partial_match',
//       answer: `من چند کد مرتبط پیدا کردم:`,
//       matches: results.partialMatches.slice(0, 3).map(m => ({
//         code: m.code,
//         description: m.dariDescription,
//         confidence: m.score
//       })),
//       suggestions: results.suggestions.length > 0 ? 
//         `شاید منظور شما کدهای خانواده ${results.suggestions[0]?.code?.toString().substring(0, 2)} باشد` : ''
//     };
//   } else {
//     return {
//       type: 'no_match',
//       answer: 'کد تصنیفی با این مشخصات پیدا نشد.',
//       suggestions: 'لطفاً نام دقیق‌تر یا کد عددی را وارد کنید.'
//     };
//   }
// }


   // Simple filter example (expand this)
function filterRows(question, allRows) {
  const questionWords = question.toLowerCase().split(' ');
  return allRows.filter(row => {
    // 1. SAFETY CHECK: Ensure row has required properties
    if (!row || !row.District || !row['Description in English']) {
      return false; // Skip invalid rows
    }
    
    // 2. SAFE SEARCH
    return questionWords.some(word => {
      // Check District (convert to string for safety)
      const districtMatch = String(row.District || '').includes(word);
      const provinceMatch = String(row.District || '').includes(word);
      
      // Check English Description
      const descMatch = String(row['Description in English'] || '')
        .toLowerCase()
        .includes(word);
      
      return districtMatch || provinceMatch || descMatch;
    })
  }).slice(0, 5); // Take only first 5 matches
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

async function generateAiResponse(question, askedLang, 
  relevantInfo, 
  systemInfoAnswers, 
  possibleCodeAnswer,
  conversation){
     
  try {

    const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
   input : `You are a payroll system expert for Afghanistan Ministry of Finance.

USER QUESTION: "${question}"

ANSWER STRICTLY BASED ON AVAILABLE  AND PREVOUS CHAT HISTORY:

1. ERROR/ISSUE DATABASE (for problems, errors, troubleshooting):
${JSON.stringify(relevantInfo, null, 2)}

2. SYSTEM/MENU DATABASE (for "where is...", "how to access...", "location of..."):
${JSON.stringify(systemInfoAnswers, null, 2)}

3. CODE/LOCATION DATABASE (for codes, tasneef, districts, provinces):
${JSON.stringify(possibleCodeAnswer, null, 2)}

4. PREVIOUS CONVERSATION:
${JSON.stringify(conversation, null, 2)}


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


NOW ANSWER:`});

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