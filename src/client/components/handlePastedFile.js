import { parseFile } from "./handleUploadFile"
import { compressImage } from "./handleUploadFile"
import { readAndBufferFile } from "./handleUploadFile"
import handleSubmitBtn from "./submitBtnHandle.js"


const handlePastedFile = () => {
    const input = document.querySelector('.inputMsg')
    const submitHandler = new handleSubmitBtn(document.querySelector('.submit-question-btn'))
    
    input.addEventListener('paste', async(e)=>{
        console.log(e.clipboardData.items[0].type, 
            'type of the item pasted')
            submitHandler.disable()
            await handlePaste(e, submitHandler)
    },{once: true})
}

async function handlePaste(e, submitHandler){
       const items = e.clipboardData.items
        for(let item of items){
            if(item.type.startsWith('image/')){
                const file = item.getAsFile()
                 e.preventDefault()
                // we are turning the file into url so we could display it on browser
                // const imageUrl = URL.createObjectURL(file)

                const preview = document.querySelector('#preview')

                    preview.innerHTML = 'parsing...'

                    const compressedImage = await compressImage(file)
                    
                   // now extract it 
                  const base64 = await readAndBufferFile(compressedImage)
            
                    const parsedText = await parseFile(base64,preview)
                    submitHandler.enable()
                    sessionStorage.setItem('parsedText', parsedText)

            }
        }
}

export default handlePastedFile