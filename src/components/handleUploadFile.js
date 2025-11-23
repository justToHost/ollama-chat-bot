

const handleUploadFile = (element) => {

   
    function pickAndParseFile(el){
        const file = el.target.files[0]

        const reader = new FileReader()
        reader.onload = (e)=>{
        
        const base64 = e.target.result

        const lightWeight = base64.split(',')[1]
        const chatInputPanel = document.querySelector('.chat-input-panel')
        console.log(chatInputPanel)
        const newEl = document.createElement('img')
        newEl.src = base64
        newEl.style.height = "30px"
        newEl.style.width = "60px"
        newEl.style.borderWidth = "1px"
        chatInputPanel.prepend(newEl)

          return lightWeight;
        }
        reader.readAsDataURL(file)
    }

   element.addEventListener('click', ()=>{
     console.log('file clicked')
     const fileInput = document.querySelector('.file-input')
     const file = fileInput.files
     fileInput.addEventListener('change', (e)=>{
        pickAndParseFile(e)
     })
    //  pickAndParseFile(file)
     fileInput.click()
   })
}

export default handleUploadFile