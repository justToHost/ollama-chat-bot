
export const translateText = async(askedText,targetLang)=> {  

   const content = ` you are a master class translator and at the same time you are extremely good at slang and ususal language in persian and pashto languages,  
    give me the translation of ${askedText} in ${targetLang}
   `

      const translatedText = await useAiWith(currentModel, 'user', content)

    
      return translatedText
}