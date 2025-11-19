
import express from "express"



const app = express()

app.use(express.json())

app.post('/api/submitQuestion', async(req,res)=>{

    const {question} = req.body

    if(!question) return res.json({message : 'no message provided !'})
    
     const relevantInfo =  await searchKnowledgeBase(question)
    
  // These MIGHT still work:
const modelsToTry = [
  'google/gemma-2b-it',
  'microsoft/DialoGPT-small',
  'facebook/blenderbot-400M-distill',
  'HuggingFaceH4/zephyr-7b-beta'
];

for (let model of modelsToTry) {
  try {
    const answer = await hf.textGeneration({
      model: model,
      inputs: `Test question`
    });
    console.log(`✅ ${model} works!`);
    break;
     return console.log(answer, 'answer')

    res.json({
        success : true,
        answer : answer
    })
  } catch (e) {
    console.log(`❌ ${model} failed`);
  }
}

})


// You also need the searchKnowledgeBase function
async function searchKnowledgeBase(question) {
  // Your company data
  const companyData = [
    "Our company ABC was founded in 2020",
    "We provide software development services",
    "Contact: info@company.af, phone: +93 123 456 789",
    "Office hours: 8AM-5PM Saturday-Thursday"
  ];
  
  // Simple search (you can improve this later)
  const keywords = question.toLowerCase().split(' ');
  const relevant = companyData.filter(info => 
    keywords.some(keyword => info.toLowerCase().includes(keyword))
  );
  
  return relevant.join(' ') || "No specific information found in our database";
}

app.listen(3001, ()=>{
    console.log('now running on port 3001')
})