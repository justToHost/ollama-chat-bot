
import { client } from "./openRouterConfig.js";

 export const useAiWith = async(model,role, content)=> {
  const completion = await client.chat.completions.create({
    model: model,
    messages: [
      {
        role: role,
        content: content,
      },
    ],
  });

   console.log(completion.choices, ' choices', completion.usage, 'usage', completion.service_tier, ' service tier')
   const answer = completion?.choices?.[0]?.message?.content;
    
    if (!answer) {
      console.log('ai threw error ! ',  answer);
      throw new Error('AI returned empty response');
    }
  console.log('the message ',  answer);
  return answer
}