
import { useAiWith } from "./seachAi.js"

let currentModel = process.env.GEMINI_MODEL || process.env.OPENROUTER_MODEL || 'ofOllamaONE'

const generateResponseContent = 
(question,relevantInfo,systemInfoAnswers,
  possibleCodeAnswer,conversation, askedLang)=>{
return `You are a payroll system expert for Ministry of Finance.

USER QUESTION: "${question}"

ANSWER STRICTLY BASED ON THESE INFORMATIONS WITH NO SELF INFO: in this ${askedLang} language.

1. ERROR/ISSUE:
${JSON.stringify(relevantInfo, null, 2)}

2. SYSTEM/MENU DATABASE:
${JSON.stringify(systemInfoAnswers, null, 2)}

3. CODE/LOCATION DATABASE (for codes, tasneef, districts, provinces): if three options check the question and the choose the best possible one otherwise say not found 
   
${JSON.stringify(possibleCodeAnswer, null, 2)}

4: PREVOUS CHAT HISTORY: ${JSON.stringify(conversation, null, 2)}

INSTRUCTIONS:

1. CLASSIFY the question type:
   - Type A: Error/Problem (e.g., "چرا معاش دانلود نمیشه؟", "error during save")
   - Type B: System Navigation (e.g., "کجا امتیازات کارکن است؟", "where to create department")
   - Type C: Codes/Locations (e.g., "کود دوشی چیست؟", "tasneef code for civilian")
   - Type D: General/Other

3. SEARCH CRITERIA:
   For Type A: Match with "question_dari", "tags", "error_signature"
   For Type B: Match with "title_dari", "key_points", "workflow"  
   For Type C: Match exact code names/numbers
   For Type D: Broad search in all sources

4. IF NO MATCH in primary source, check OTHER sources.

NOW ANSWER:`
}



export const generateAiResponse = async(question, askedLang, 
  relevantInfo, 
  systemInfoAnswers, 
  possibleCodeAnswer,
  conversation)=>{

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