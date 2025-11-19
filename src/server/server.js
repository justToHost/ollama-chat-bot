
import express from "express"
import {Ollama} from "ollama"
import axios from "axios"

const ollama = new Ollama()
const app = express()
app.use(express.json())
const model = 'gemma3:1b'


app.post('/api/submitQuestion', async(req,res)=>{

    const {question} = req.body

    if(!question) return res.json({message : 'no message provided !'})
    
        // step 1 detect language of question
    const askedLang = detectLanguage(question)
     
  
     const relevantInfo =  await searchKnowledgeBase(question)
     console.log('answered question in english so far ', relevantInfo)

    //  step 3 translate the english text back to user questoin language

    console.log(askedLang, ' this should usually be persian ')
   
  try {
   const answer = await ollama.generate({
      model: model, 
      prompt: ` answer the question ${question} as precise as possible 
      looking up the context ${context}  but dont say based on the provided text.`
    });

    const simplifiedAnswer =  answer.response.replace(/\*\*/g, '')

     const targetLanguageAnswer = await translateWithOllama(answer.response, askedLang)


     return console.log(targetLanguageAnswer)

    res.json({
        success : true,
        answer : targetLanguageAnswer
    })
  } catch (e) {
    console.log(`❌ ${model} failed`);
  }

})


// auto detect the language

function detectLanguage(question) {
  // Detects both Dari AND Pashto (same Arabic script)
  return /[\u0600-\u06FF]/.test(question) ? 'afghan' : 'english';
}

 async function translateWithOllama(askedText, targetLang) {
    
    const response = await ollama.generate({
        model: model,
        prompt: `Translate "${askedText}" to "${targetLang} for educational purpose !"`
    });
        return response.response
}

// You also need the searchKnowledgeBase function
async function searchKnowledgeBase(question) {


console.log('the question to be translated to english', question)

//tep 2 : question question should be translated to english since data is in english
//    const translatedQuestion = await translateWithOllama(question,'English')
const nationalLang = 'fa' || 'ps'

const translatedQuestion = await translateText(question,'fa','en')

  return console.log(`translated question ${askedLang} to english  `, translatedQuestion)


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
  
//   const keywords = translatedQuestion.toLowerCase().split(' ');

//   const relevant = companyData.filter(info => 
//     keywords.some(keyword => info.toLowerCase().includes(keyword))
//   );
  
//   return relevant.join(' ') || "No specific information found in our database";
return companyData;
}

async function translateText(text, fromLang, toLang) {
  const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: fromLang, // 'ps' or 'fa'
      target: toLang    // 'en' or vice versa
  });
     console.log(response, 'response of libre translation ')
  return response
}

app.listen(3001, ()=>{
    console.log('now running on port 3001')
})