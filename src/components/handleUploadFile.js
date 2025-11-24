
import axios from "axios"
import fetchResponse from "./fetchResponse"


const handleUploadFile = (element) => {

    async function pickAndParseFile(el){
        const file = el.target.files[0]
        const compressedImage = await compressImage(file)

      
        const base64 = readAndBufferFile(compressedImage)

        const imgUrl = URL.createObjectURL(file)

        const chatInputPanel = document.querySelector('.chat-input-panel')
        console.log(chatInputPanel)
        const preview = document.getElementById('preview')
        console.log(preview)

        const imgEl = `<img src="${imgUrl}" />`
        preview.innerHTML = imgEl

          const parsedText = await parseFile(base64)
          const question_inputEl = document.querySelector('.inputMsg')
          question_inputEl.value = parsedText
    }

   element.addEventListener('click',()=>{
     console.log('file clicked')
     const fileInput = document.querySelector('.file-input')
     const file = fileInput.files
     fileInput.addEventListener('change', async(e)=>{
        await pickAndParseFile(e)
     })
    //  pickAndParseFile(file)
     fileInput.click()
   })
}


function readAndBufferFile(compressedFile){
   let readFile;
   const reader = new FileReader()
    reader.onload = async(e)=>{    
      
      readFile =  e.target.result
      console.log(readFile)
      return readFile
}
  reader.readAsDataURL(compressedFile)
   
}

async function parseFile(file){

//  return console.log(file)

  const response = await axios.post('/api/upload/doc',{file})

  console.log(response, 'response')

  if(response.status === 200 && response.data.success){
    console.log(response.data)

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
export {parseFile}