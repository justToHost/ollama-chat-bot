
import express from "express"
import {Ollama} from "ollama"
import axios from "axios"
import dotenv from "dotenv"
import OpenAI from "openai"


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
       
     const relevantInfo =  await searchKnowledgeBase(question)
      console.log('answered question in english so far ', relevantInfo)

    //  step 3 translate the english text back to user questoin language

  try {
    const response = await client.responses.create({
    model: process.env.CURRENT_MODEL,
    input: ` answer the question ${question} 
    only based on this context ${relevantInfo}. 
    and if the question was irrelevant , 
    respond : "sorry , its irrevant !" in the language of asked question `
});

    const simplifiedAnswer =  response.output_text

     console.log(simplifiedAnswer, ' the answer ', ' in ', askedLang)

     const  targetLanguageAnswer = await translateText(simplifiedAnswer, askedLang)


    res.json({
        success : true,
        answer : targetLanguageAnswer
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
     return just the name of the language. Ex : "pasho" or "dari" or "persian" `
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


  const companyData = [
   `Antarctica is the world's southernmost, highest, 
      driest, and coldest continent, covered almost entirely 
      by a massive ice sheet that holds about 90% of the world's ice 
      and 80% of its freshwater.. 
      It has no native human population, but many countries 
      operate scientific research stations there, 
      which are primarily used during the summer months. 
      Antarctica is also the windiest continent, 
      and its extreme cold has led to the coldest 
      temperatures ever recorded on Earth.`
  ];
  
return companyData;
}

app.listen(3001, ()=>{
    console.log('now running on port 3001')
})