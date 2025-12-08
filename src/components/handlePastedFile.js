import { parseFile } from "./handleUploadFile"
import { compressImage } from "./handleUploadFile"
import { readAndBufferFile } from "./handleUploadFile"

const handlePastedFile = () => {
    const input = document.querySelector('.inputMsg')
    input.addEventListener('paste', async(e)=>{
        console.log(e.clipboardData.items[0].type, 
            'type of the item pasted')

        const items = e.clipboardData.items
        for(let item of items){
            if(item.type.startsWith('image/')){
                const file = item.getAsFile()
                 e.preventDefault()
                // we are turning the file into url so we could display it on browser
                const imageUrl = URL.createObjectURL(file)

                const preview = document.querySelector('#preview')

                    preview.innerHTML = 'parsing...'

                    const compressedImage = await compressImage(file)

                   // now extract it 
                  const base64 = await readAndBufferFile(compressedImage)
            
                    const parsedText = await parseFile(base64,preview)
                    sessionStorage.setItem('parsedText', parsedText)

            }
        }
    })
}

export default handlePastedFile