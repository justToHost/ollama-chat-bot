import { parseFile } from "./handleUploadFile"
import { compressImage } from "./handleUploadFile"
import { readAndBufferFile } from "./handleUploadFile"
import handleSubmitBtn from "./submitBtnHandle.js"
import { toggleSendIcon } from "./handleSendIconToggle.js"
import axios from "axios"
import { translateT } from "./TranslateText.js"


const handlePastedFile = (input, sendBtn) => {
    const submitHandler = new handleSubmitBtn(document.querySelector('.submit-question-btn'))

    if(!input || !submitHandler || !sendBtn) return console.log('either input , submit handler or enter btn is unknown !')

    input.addEventListener('paste', async(e)=>{
            
            const result = await handlePaste(e, submitHandler, input, sendBtn)
            const previewImg = input.closest('.chat-input-panel')?.querySelector('img')            
             previewImg && sendBtn.classList.add('show')
    })
}

async function handlePaste(e, submitHandler, input, sendBtn){
       const items = e.clipboardData.items
        for(let item of items){
            if(item.type.startsWith('image/')){
                submitHandler.disable()

                const file = item.getAsFile()
                 e.preventDefault()
                // we are turning the file into url so we could display it on browser
                // const imageUrl = URL.createObjectURL(file)

                const preview = document.querySelector('#preview')

                    preview ? preview.innerHTML = 'parsing...' : console.log('preview el is undefined ')

                    const compressedImage = await compressImage(file)
                    
                    if(!compressedImage) console.log('failure in compressing image') 
                   // now extract it 
                  const base64 = await readAndBufferFile(compressedImage)
            
                    const parsedText = await parseFile(base64,preview)
                    if(!parsedText){
                         console.log('failur while parsing the text')

                        const userChosenLang = document.querySelector('#lang').value
                        
                         const tText = await translateT('please paste a clearer screen shot', 'en', `prs`)
                         
                         
                         alert(tText.translatedText)
                         const inputpanelImg = input.closest('.chat-input-panel')?.querySelector('img')
                         console.log(inputpanelImg, 'img ')
                         inputpanelImg.remove()
                         sendBtn.classList.remove('show')
                         return
                    } 

                    submitHandler.enable()
                  
                    sessionStorage.setItem('parsedText', parsedText)

            }
        }
}

export default handlePastedFile