import { parseFile } from "./handleUploadFile"
import { compressImage } from "./handleUploadFile"
import { readAndBufferFile } from "./handleUploadFile"

const handlePastedFile = () => {
    const input = document.querySelector('.inputMsg')
    input.addEventListener('paste', async(e)=>{
        console.log(e.clipboardData.items[0].type, 'type of the item pasted')

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

                   console.log(base64, 'buffered pasted file')
                    
                   console.log('parsing ...', base64)
                    const parsedText = await parseFile(base64,preview)
                    sessionStorage.setItem('parsedText', parsedText)

            }
        }
    })
}

// const input = document.getElementById('screenshotInput');
// const preview = document.getElementById('preview');

// input.addEventListener('paste', async (e) => {
//     const items = e.clipboardData.items;
    
//     for (let item of items) {
//         if (item.type.startsWith('image/')) {
//             e.preventDefault();
            
//             const file = item.getAsFile();
//             const imageUrl = URL.createObjectURL(file);
            
//             // Display preview
//             preview.innerHTML = `<img src="${imageUrl}" style="max-width: 300px">`;
            
//             // Convert to buffer for OCR
//             const buffer = await file.arrayBuffer();
//             console.log('Screenshot captured:', buffer);
            
//             // Send to your OCR function
//             const text = await extractTextFromImage(buffer);
//             console.log('Extracted text:', text);
            
//             break;
//         }
//     }
// });

export default handlePastedFile