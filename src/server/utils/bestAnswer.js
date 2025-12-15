
export default function findBestMatch(tasnifData, locationData, question) {
  const q = question.toLowerCase()
  
  // 1. Find any code
  const codeInQuestion = q.match(/\b\d{3,}\b/);
  if (codeInQuestion) {
    const code = codeInQuestion[0];
    
    // Check tasnif first
    const tasnifItem = tasnifData.find(d => d.tasnif_code == code);
    if (tasnifItem) return `Tasnif Code ${code}: ${tasnifItem.english_description}`;
    
    // Then check district
    const districtItem = locationData.find(d => d.district_code == code);
    if (districtItem) return `District ${code}: ${districtItem.english_description}, ${districtItem.province}`;
    
    return `Code ${code} not found`;
  }
  
  // 2. Search in both datasets
  const words = q.split(' ').filter(w => w.length > 3);
  
  const allData = [
    ...tasnifData.map(d => ({...d, type: 'TASNIF'})),
    ...locationData.map(d => ({...d, type: 'LOCATION', code: d.district_code}))
  ];
  
  const found = allData.find(d => {
    const text = [
      d.english_description || '',
      d.dari_description || '',
      d.province || '',
      d.country || ''
    ].join(' ').toLowerCase();
    
    return words.some(word => text.includes(word));
  });
  
  if (found) {
    if (found.type === 'TASNIF') {
      return `Tasnif Code ${found.tasnif_code}: ${found.english_description}`;
    } else {
      return `District ${found.district_code}: ${found.english_description}, ${found.province}, ${found.country}`;
    }
  }
  
  return 'No matches found';
}

// export default function findBestMatch(data, question) {
//   const q = question.toLowerCase().trim();
  
//   // Outcome 1: Look for a specific tasnif code in the question
//   const codeMatch = q.match(/\b(\d{3,})\b/);
//   if (codeMatch) {
//     const code = codeMatch[1];
//     const found = data.find(item => item.tasnif_code.toString() === code);
    
//     if (found) {
//       return {
//         status: 'FOUND_CODE',
//         answer: `Code ${code} is: ${found.english_description || found.dari_description}`,
//         details: {
//           tasnif_code: found.tasnif_code,
//           ministry_code: found.ministry_code,
//           english_desc: found.english_description,
//           dari_desc: found.dari_description
//         }
//       };
//     } else {
//       return {
//         status: 'CODE_NOT_FOUND',
//         answer: `No item found with tasnif code ${code}`,
//         suggestion: 'Check if the code is correct'
//       };
//     }
//   }
  
//   // Outcome 2: Look for a description to find its code
//   if (q.includes('code of') || q.includes('tasnif code')) {
//     // Extract what they're asking about (remove question words)
//     const searchPhrase = q
//       .replace(/.*?(?:code of|tasnif code of|what is the code of|tell me code of)\s*/i, '')
//       .replace(/\?$/, '')
//       .trim();
    
//     if (searchPhrase) {
//       const matches = data.filter(item => {
//         const desc = (item.english_description || '').toLowerCase() + ' ' + 
//                      (item.dari_description || '').toLowerCase();
//         return desc.includes(searchPhrase);
//       });
      
//       if (matches.length > 0) {
//         return {
//           status: 'FOUND_DESCRIPTION',
//           answer: `Found ${matches.length} match(es) for "${searchPhrase}":`,
//           matches: matches.map(m => ({
//             tasnif_code: m.tasnif_code,
//             ministry_code: m.ministry_code,
//             english_desc: m.english_description,
//             dari_desc : m.dari_description
//           }))
//         };
//       } else {
//         return {
//           status: 'DESCRIPTION_NOT_FOUND',
//           answer: `No items found for "${searchPhrase}"`,
//           suggestion: 'Try different keywords'
//         };
//       }
//     }
//   }
  
//   // Outcome 3: General search for anything mentioned
//   const keywords = q.split(' ')
//     .filter(word => word.length > 3)
//     .filter(word => !['what', 'tell', 'code', 'tasnif', 'ministry'].includes(word));
  
//   if (keywords.length > 0) {
//     const results = [];
    
//     data.forEach(item => {
//       const allText = (item.english_description || '') + ' ' + 
//                      (item.dari_description || '') + ' ' +
//                      (item.pashto_description || '');
//       const textLower = allText.toLowerCase();
      
//       const matchedKeywords = keywords.filter(kw => textLower.includes(kw));
      
//       if (matchedKeywords.length > 0) {
//         results.push({
//           tasnif_code: item.tasnif_code,
//           ministry_code: item.ministry_code,
//           english_desc: item.english_description,
//           dari_desc : item.dari_description,
//           match_score: matchedKeywords.length,
//           matched_keywords: matchedKeywords
//         });
//       }
//     });
    
//     if (results.length > 0) {
//       results.sort((a, b) => b.match_score - a.match_score);
      
//       return {
//         status: 'PARTIAL_MATCHES',
//         answer: `Found ${results.length} possibly related items`,
//         best_matches: results.slice(0, 3) // Top 3 matches
//       };
//     }
//   }
  
//   // Nothing found
//   return {
//     status: 'NO_MATCH',
//     answer: 'Could not find any matching items. Try asking differently.',
//     example_questions: [
//       "What is code 21111?",
//       "What is the tasnif code for permanent employees?",
//       "Find projects about coronavirus"
//     ]
//   };
// }




function searchInSystemInfo(question, systemInfoAnswers) {
  if (!systemInfoAnswers || !Array.isArray(systemInfoAnswers)) return [];
  
  const questionLower = question.toLowerCase();
  const questionWords = questionLower
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  const scoredResults = systemInfoAnswers.map(item => {
    let score = 0;
    
    // 1. Check title_dari (most important for system questions)
    if (item.title_dari) {
      const titleLower = item.title_dari.toLowerCase();
      
      // Exact match (user asking about specific feature)
      if (titleLower.includes(questionLower)) {
        score += 20;
      }
      
      // Word matches
      questionWords.forEach(word => {
        if (titleLower.includes(word)) {
          score += 5;
        }
      });
    }
    
    // 2. Check title_english
    if (item.title_english) {
      const titleEngLower = item.title_english.toLowerCase();
      if (titleEngLower.includes(questionLower)) {
        score += 15;
      }
      
      questionWords.forEach(word => {
        if (titleEngLower.includes(word)) {
          score += 3;
        }
      });
    }
    
    // 3. Check key_points array
    if (item.key_points && Array.isArray(item.key_points)) {
      item.key_points.forEach(point => {
        const pointLower = point.toLowerCase();
        if (pointLower.includes(questionLower)) {
          score += 8;
        }
        
        questionWords.forEach(word => {
          if (pointLower.includes(word)) {
            score += 2;
          }
        });
      });
    }
    
    // 4. Check category/sub_category
    if (item.category) {
      const categoryLower = item.category.toLowerCase();
      if (categoryLower.includes(questionLower)) {
        score += 6;
      }
    }
    
    if (item.sub_category) {
      const subCategoryLower = item.sub_category.toLowerCase();
      if (subCategoryLower.includes(questionLower)) {
        score += 4;
      }
    }
    
    // 5. Check workflow steps (for "how to" questions)
    if (item.workflow && Array.isArray(item.workflow)) {
      questionWords.forEach(word => {
        // Check for "how to" words
        if (['چگونه', 'چطور', 'طریقه', 'روش', 'مراحل', 'قدم'].includes(word)) {
          score += 3; // Bonus for "how to" questions
        }
        
        item.workflow.forEach(step => {
          if (step.toLowerCase().includes(word)) {
            score += 1;
          }
        });
      });
    }
    
    // 6. Check notes
    if (item.notes && Array.isArray(item.notes)) {
      item.notes.forEach(note => {
        questionWords.forEach(word => {
          if (note.toLowerCase().includes(word)) {
            score += 1;
          }
        });
      });
    }
    
    // 7. Special bonus for location words
    const locationWords = ['کجا', 'کجاست', 'منوی', 'منو', 'موقعیت', 'محل'];
    const hasLocationWord = locationWords.some(word => questionLower.includes(word));
    
    if (hasLocationWord && item.menu_location) {
      score += 10; // Big bonus for "where" questions with location info
    }
    
    return {
      ...item,
      _score: score,
      _type: 'system'
    };
  });
  
  return scoredResults
    .filter(item => item._score > 0)
    .sort((a, b) => b._score - a._score);
}


function searchInCodes(question, possibleCodeAnswer) {
  if (!possibleCodeAnswer || !Array.isArray(possibleCodeAnswer)) return [];
  
  const questionLower = question.toLowerCase();
  
  return possibleCodeAnswer
    .filter(item => {
      // Check if any field in the item contains words from the question
      const searchableText = Object.values(item)
        .filter(value => typeof value === 'string' || typeof value === 'number')
        .map(value => String(value).toLowerCase())
        .join(' ');
      
      // Split question into meaningful words
      const questionWords = questionLower
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      // Return true if any question word appears in the searchable text
      return questionWords.some(word => searchableText.includes(word));
    })
    .slice(0, 3); // Limit to 10 results
}

function searchInErrors(question, relevantInfo) {
  if (!relevantInfo || !Array.isArray(relevantInfo) || relevantInfo.length === 0) {
    return []; // Return empty if no data
  }
  
  const questionLower = question.toLowerCase();
  const questionWords = questionLower
    .split(/\s+/)
    .filter(word => word.length > 2); // Remove very short words
  
  // Score each error entry
  const scoredErrors = relevantInfo.map(error => {
    let score = 0;
    
    // 1. Check question_dari (exact match gets high score)
    if (error.question_dari) {
      const errorQuestionLower = error.question_dari.toLowerCase();
      
      // Exact phrase match (highest priority)
      if (errorQuestionLower.includes(questionLower)) {
        score += 10;
      }
      
      // Word-by-word match
      const matchedWords = questionWords.filter(word => 
        errorQuestionLower.includes(word)
      );
      
      if (matchedWords.length > 0) {
        score += matchedWords.length * 2;
      }
    }
    
    // 2. Check error_signature (exact match gets high score)
    if (error.error_signature) {
      const signatureLower = error.error_signature.toLowerCase();
      if (signatureLower.includes(questionLower)) {
        score += 12; // Even higher for exact error codes
      }
      
      // Check if question contains parts of error signature
      questionWords.forEach(word => {
        if (signatureLower.includes(word)) {
          score += 3;
        }
      });
    }
    
    // 3. Check tags array
    if (error.tags && Array.isArray(error.tags)) {
      error.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (questionLower.includes(tagLower)) {
          score += 4;
        }
        
        // Also check if tag contains question words
        questionWords.forEach(word => {
          if (tagLower.includes(word)) {
            score += 2;
          }
        });
      });
    }
    
    // 4. Check user_friendly_title
    if (error.user_friendly_title) {
      const titleLower = error.user_friendly_title.toLowerCase();
      if (titleLower.includes(questionLower)) {
        score += 8;
      }
      
      questionWords.forEach(word => {
        if (titleLower.includes(word)) {
          score += 2;
        }
      });
    }
    
    // 5. Check answer/simple_explanation (lower weight)
    if (error.answer) {
      const answerLower = error.answer.toLowerCase();
      questionWords.forEach(word => {
        if (answerLower.includes(word)) {
          score += 1;
        }
      });
    }
    
    if (error.simple_explanation) {
      const explanationLower = error.simple_explanation.toLowerCase();
      questionWords.forEach(word => {
        if (explanationLower.includes(word)) {
          score += 1;
        }
      });
    }
    
    // 6. Bonus for exact ID match
    if (error.id && questionLower.includes(error.id.toString())) {
      score += 15;
    }
    
    // 7. Bonus for exact reference code match
    if (error.reference_code && questionLower.includes(error.reference_code)) {
      score += 15;
    }
    
    return {
      ...error,
      _score: score,
      _matchedFields: getMatchedFields(questionLower, error) // For debugging
    };
  });
  


  // Filter and sort
  const relevantErrors = scoredErrors
    .filter(error => error._score > 0)
    .sort((a, b) => b._score - a._score);
  
  return relevantErrors;
}

// Helper function to track which fields matched (for debugging)
function getMatchedFields(questionLower, error) {
  const matchedFields = [];
  
  if (error.question_dari?.toLowerCase().includes(questionLower)) {
    matchedFields.push('question_dari');
  }
  
  if (error.error_signature?.toLowerCase().includes(questionLower)) {
    matchedFields.push('error_signature');
  }
  
  if (error.tags?.some(tag => questionLower.includes(tag.toLowerCase()))) {
    matchedFields.push('tags');
  }
  
  return matchedFields;
}