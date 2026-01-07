import { parseFile } from "./handleUploadFile"
import { compressImage } from "./handleUploadFile"
import { readAndBufferFile } from "./handleUploadFile"
import handleSubmitBtn from "./submitBtnHandle.js"
import { toggleSendIcon } from "./handleSendIconToggle.js"


const handlePastedFile = () => {
    const input = document.querySelector('.inputMsg')
    const submitHandler = new handleSubmitBtn(document.querySelector('.submit-question-btn'))
    const sendBtn = document.querySelector('.submit-question-btn')

    if(!input || !submitHandler || !sendBtn) return console.log('either input , submit handler or enter btn is unknown !')

    input.addEventListener('paste', async(e)=>{
        console.log(e.clipboardData.items[0].type, 
            'type of the item pasted')
            submitHandler.disable()
            await handlePaste(e, submitHandler, input, sendBtn)
    })
}

async function handlePaste(e, submitHandler, input, sendBtn){
       const items = e.clipboardData.items
        for(let item of items){
            if(item.type.startsWith('image/')){
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
                    if(!parsedText) return console.log('failur while parsing the text')

                    submitHandler.enable()
                     // THE BELOW SHOULD BE FIXED 
                      toggleSendIcon(input,sendBtn)
                    sessionStorage.setItem('parsedText', parsedText)

            }
        }
}

export default handlePastedFile