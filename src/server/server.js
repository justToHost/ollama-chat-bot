
import express from "express"
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
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
// console.log('pdf', stringify(pdf, '', 2))
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
       
     const relevantInfo =  await searchKnowledgeBase(question)
      console.log('answered question in english so far ', relevantInfo)

    //  step 3 translate the english text back to user questoin language

  try {
    const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
    input: `You are a specialized accounting and payroll assistant for the Ministry of Finance.

QUESTION: "${question}"

CONTEXT DATA: ${relevantInfo}

RESPONSE REQUIREMENTS:
- Answer strictly based ONLY on the provided context data
- If the question is irrelevant to payroll, accounting, or ministry financial matters, respond: "This query is outside my financial domain expertise" in the same language as the question
- Provide clear, structured answers with:
  • Separate paragraphs for complex explanations
  • Bullet points for lists and steps
  • Bold section headings without using markdown symbols
  • Precise numerical data when available

SPECIALIZED FOCUS AREAS:
• Salary calculations and deductions
• Tax regulations and compliance
• Employee payroll records
• Financial reporting standards
• Government accounting procedures
• Budget allocation and management
• Audit requirements and documentation

Maintain professional tone suitable for ministry-level financial operations.`
});

    const simplifiedAnswer =  response.output_text

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

async function detectLanguage(question) {
  
  const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
    input: ` you are a master class translator,  
    give me the exact language of this ${question}
     return just the name of the language. 
     Ex : "pasho" or "dari" or "persian" `
});

console.log('output of the confirmation language', response.output)
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

// You also need the searchKnowledgeBase function
async function searchKnowledgeBase(question) {


console.log('the question to be translated to english', question)

//tep 2 : question question should be translated to english since data is in english
//    const translatedQuestion = await translateText(question,'English')

const fileBuffered = await fs.readFile(path.join(__dirname, '/pdfFiles/tpms.pdf'))
console.log(fileBuffered, 'buffer of pdf file')
const parser = new PDFParse({ data: fileBuffered }); // Use 'data' not 'url'

const text = await parser.getText()
 
return text.pages[0].text
}

app.listen(3001, ()=>{
    console.log('now running on port 3001')
})