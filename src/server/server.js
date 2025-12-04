
import express, { response } from "express"
import {Ollama} from "ollama"
import axios from "axios"
import dotenv from "dotenv"
import OpenAI from "openai"
import fs from "fs/promises"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {PDFParse} = require('pdf-parse');
import path, { parse } from "path"
import { fileURLToPath } from "url"
import Tesseract from "tesseract.js"
import paymentSystemTrainingData from "./trainedData.js"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


dotenv.config()

const ollama = new Ollama()
const app = express()
app.use(express.json())

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

app.post('/api/submitQuestion', async(req,res)=>{

    const {question} = req.body

    if(!question) return res.json({message : 'no message provided !'})
    
        // step 1 detect language of question
    const askedLang = await detectLanguage(question)
       
    console.log('language ', askedLang)

     const relevantInfo = searchKnowledgeBase(question)

      console.log(relevantInfo, 'releveant info')
   


    //  step 3 translate the english text back to user questoin language

  try {
    const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
    input: `You are a specialized accounting and payroll assistant for the Ministry of Finance who remembers the previous conversations very well.

QUESTION: "${question}"

CONTEXT DATA: ${relevantInfo}

RESPONSE REQUIREMENTS:

- Answer strictly based ONLY on the provided context and previous conversation flow.
- If the question is irrelevant to payroll, accounting, or ministry financial matters and unrelated to previous discussions, respond: "I'm sorry, I don't have information about that." in the same language as the question.
- Dont make it too lengthy unnecessarily. 

Exception:
- Respond appropriately to greetings or gratitude.
- Answer follow-up questions related to previous discussions based on your knowledge.

`});

    const simplifiedAnswer = response.output_text

      console.log(simplifiedAnswer, 'simlified answer')
     console.log(simplifiedAnswer, ' the answer ', ' in ', askedLang)

     const  targetLanguageAnswer = await translateText(simplifiedAnswer, askedLang)

     const cleanAnswer = targetLanguageAnswer
        .replace(/\*\*/g, '')  // Remove bold markers
        .replace(/\*/g, '')    // Remove italic markers  
        .replace(/\n\s*\n/g, '\n\n') // Clean multiple newlines
        .trim();

    res.json({
        success : true,
        answer : cleanAnswer
    })
  } catch (e) {
    console.log(`❌ model failed with an error`);
  }

})

function searchKnowledgeBase(q){
  const questonsPieces =  q.split(' ')

  const trainedData = JSON.stringify(paymentSystemTrainingData, null, 2)
  paymentSystemTrainingData.map(data => data)
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





// scanning file upload

app.post('/api/upload/doc', async(req,res)=>{

  const {file} = req.body


  if(!file) return res.json({message : 'invalid or unknown file'})

  const result = await Tesseract.recognize(
    file,
    'eng', // language
    { logger: m => console.log(m) } // optional logger
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