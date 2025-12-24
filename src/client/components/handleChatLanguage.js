

const handleChatLanguage = () => {
     const langEl = document.querySelector('#lang')

//   langEl.addEventListener('change', (e)=>{
    const selectedLang = langEl.value

    if(selectedLang.toLowerCase() === 'english'){
        return 'english'
    }else if(selectedLang.toLowerCase() === 'pashto'){
        return 'pashto'
    }else{
        return 'dari'
    }
//   })

}

export default handleChatLanguage