export default function findBestMatch(question, codes) {
  const q = question.toLowerCase();
  const questionWords = q.split(/\s+/).filter(Boolean);
  const normalizedData = normalizeLocationData(codes);
  

  const izafakari = normalizedData.find(row => row.dari_description.includes('اضافه کاری'))
  // console.log('normalized data : ', izafakari || "not found")


  // STEP 1: Find ALL matches
  const matches = normalizedData.filter(code => {
    const searchTerms = [
      code.english_description?.toLowerCase(),
      code.dari_description,
      code.district_code ? code.district_code.toString() : null,
      code.tasnif_code ? code.tasnif_code.toString() : null,
      code.province ? code.province.toString() : null
    ].filter(term => term && term);
    

    return searchTerms.some(term =>{
      return questionWords.some(word => term.includes(word))
    })
  }).slice(0, 3);

 console.log('matches ', matches, matches.length)

  if (matches.length === 0) return null;
  
  return matches

  // STEP 2: Determine user intent MORE PRECISELY
  const wantsDistrictsOfProvince = 
    q.includes('districts of') || 
    q.includes('districts in') ||
    q.includes('district of') ||
    q.includes('show districts') ||
    q.includes('list districts');
  
  const wantsSpecificDistrict = 
    (q.includes('district') && !wantsDistrictsOfProvince) ||
    q.includes('capital') ||
    /\b\d{4}\b/.test(q); // Matches 4-digit codes like 0101, 0102
  
  const wantsProvinceInfo = 
    q.includes('province') && !wantsDistrictsOfProvince ||
    q.includes('ولایت') ||
    /\b\d{2}\b/.test(q); // Matches 2-digit codes like 01
  
  // STEP 3: Return appropriate result
  if (wantsDistrictsOfProvince) {
    // Find the mentioned province
    const mentionedProvince = matches.find(m => !m.district_code);
    if (!mentionedProvince) return matches[0];
    
    // Return ALL districts of this province
    const provinceCode = mentionedProvince.province;
    const allDistricts = normalizedData.filter(d => 
      d.district_code && 
      d.province === provinceCode
    );
    
    return {
      province: mentionedProvince,
      districts: allDistricts,
      count: allDistricts.length
    };
  }
  
  if (wantsSpecificDistrict) {
    // Find district that matches BOTH name AND province context
    const mentionedProvince = matches.find(m => !m.district_code);
    
    if (mentionedProvince) {
      // User mentioned a province, find district within that province
      const provinceCode = mentionedProvince.province;
      const districtInProvince = matches.find(m => 
        m.district_code && 
        m.province === provinceCode
      );
      
      if (districtInProvince) return districtInProvince;
    }
    
    // Fallback: any district from matches
    return matches.find(m => m.district_code) || matches[0];
  }
  
  if (wantsProvinceInfo) {
    return matches.find(m => !m.district_code) || matches[0];
  }
  
  // DEFAULT: Smart selection
  // If matches include both province and its districts, return province with districts
  const provinceMatch = matches.find(m => !m.district_code);
  if (provinceMatch) {
    const provinceCode = provinceMatch.province;
    const relatedDistricts = normalizedData.filter(d => 
      d.district_code && 
      d.province === provinceCode
    );
    
    if (relatedDistricts.length > 0) {
      return {
        ...provinceMatch,
        related_districts: relatedDistricts
      };
    }
  }
  


  return matches.find(m => m.district_code) || matches[0];
}


function decideBestMatch(question, matches, allData) {
  // Prioritize matches that align with more specific user intent
  // For simplicity, return the first match for now
  return matches[0];
} 

function normalizeLocationData(rawData) {
  const normalized = [];
  let lastProvince = "";
  
  rawData.forEach(row => {
    // If province exists in this row, update lastProvince
    if (row.province && row.province) {
      lastProvince = row.province;
    }
    
    // Create normalized object
    const normalizedRow = {
      province: row.province || lastProvince,
      district_code: row.district_code || "",
      english_description: row.english_description || "",
      dari_description: row.dari_description || "",
      tasnif_code : row.tasnif_code || ""
    };
    
    normalized.push(normalizedRow);
  });
  
  return normalized;
}
