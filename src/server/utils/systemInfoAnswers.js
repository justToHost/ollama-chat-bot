
import { systemInfo } from "../systemInfo.js";


export const closestAnswersForSystemInfo = (question)=>{
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
