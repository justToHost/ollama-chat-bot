import { parseFile } from "./handleUploadFile"

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
                const imgEl = `<img src="${imageUrl}" />`
                    preview.innerHTML = imgEl

                    // now extract it 
                  readAndBufferFile(file)
                  return console.log(pastedFile)


                   console.log(base64String, 'buffered pasted file')
                    
                   console.log('parsing ...', base64String)
                    const parsedPastedFile = await parseFile(base64String)

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