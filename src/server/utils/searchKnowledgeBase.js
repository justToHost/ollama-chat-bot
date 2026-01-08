
import paymentSystemTrainingData from "../trainedData.js";

export const searchKnowledgeBase = (q)=>{
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