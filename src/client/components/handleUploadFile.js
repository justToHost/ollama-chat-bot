
import axios from "axios"
import getBaseUrl from "./baseUrl.js"

const baseUrl = getBaseUrl()


const handleUploadFile = (element) => {

   element.addEventListener('click',()=>{
     console.log('file clicked')
     const fileInput = document.querySelector('.file-input')
     const file = fileInput.files

     fileInput.addEventListener('change', async(e)=>{
        await pickAndParseFile(e)
     })
     fileInput.click()
   })
}

async function pickAndParseFile(el){
        const file = el.target.files[0]

          const chatInputPanel = document.querySelector('.chat-input-panel')
          console.log(chatInputPanel)
          const preview = document.getElementById('preview')
          console.log(preview)

          preview.innerHTML = 'parsing ...'

          // first compress the file to get ready for server
        const compressedImage = await compressImage(file)

        //bufferize the compressed file to be  accepted by api
        const base64 = await readAndBufferFile(compressedImage)

        console.log('base 64 returned ', base64)

      // parsed text out of the file
        const parsedText = await parseFile(base64,preview)
        sessionStorage.setItem('parsedText', parsedText)
    }


async function readAndBufferFile(compressedFile){

   return new Promise((resolve, reject)=>{
     const reader = new FileReader()

      reader.onload = (e)=> resolve(e.target.result)
      reader.onerror = reject

      reader.readAsDataURL(compressedFile)
   })
}

async function parseFile(file,filePreview){

  console.log(file, 'the sending file')
  const response = await axios.post(`${baseUrl}/api/upload/doc`,{file})

  console.log(response, 'response')

  if(response.status === 200 && response.data.success){
    console.log(response.data)

     const imgEl = `<img src="${file}" />`
    filePreview.innerHTML = imgEl

    const {parsedText} = response.data

    return parsedText
  }
}


function compressImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7);
    };
    
    img.src = URL.createObjectURL(file);
    
    return img
  });
}

export default handleUploadFile 
export {parseFile, compressImage, readAndBufferFile}