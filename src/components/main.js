import '../styles/style.css'
import { sendQuestion } from './handle-submit-message.js'
import handleBotClick from './handleBotClick.js'
import handleUploadFile from './handleUploadFile.js'
import handlePastedFile from './handlePastedFile.js'
import handleVoiceRecord from './handleVoiceRecord.js'
document.querySelector('#app').innerHTML = `

  <div class="bot">
     <svg width="30" height="30" 
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 32 32"><path fill="#fff" d="M28.586 18H28a8 8 0 0 0-8-8h-2V8.445a4 4 0 1 0-4 0V10h-2a8 8 0 0 0-8 8h-.586A1.414 1.414 0 0 0 2 19.414v3.172A1.414 1.414 0 0 0 3.414 24H4v1a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3v-1h.586A1.414 1.414 0 0 0 30 22.586v-3.172A1.414 1.414 0 0 0 28.586 18M11 22a3 3 0 1 1 3-3a3 3 0 0 1-3 3m10 0a3 3 0 1 1 3-3a3 3 0 0 1-3 3"/></svg>
   </div>

  <div class="container">
        <div class="chats-area">
          <p class="systemMsg message" >How can i help you ?</p>
        </div>

        <div class="chat-input-panel">
              <div id="preview"></div>
            <input class="inputMsg" type="text" required placeholder="add your question">
             <div class="file-upload-buttons">
                <button class="upload-file">
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v5a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2V7a4 4 0 0 0-4-4v0a4 4 0 0 0-4 4v8a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V5"/></svg>
                </button>
                <input type="file" class="file-input" hidden>
                
                 <button class="record-voice-btn">
                 <?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 83.44 122.88" style="enable-background:new 0 0 83.44 122.88" xml:space="preserve"><g><path d="M45.04,95.45v24.11c0,1.83-1.49,3.32-3.32,3.32c-1.83,0-3.32-1.49-3.32-3.32V95.45c-10.16-0.81-19.32-5.3-26.14-12.12 C4.69,75.77,0,65.34,0,53.87c0-1.83,1.49-3.32,3.32-3.32s3.32,1.49,3.32,3.32c0,9.64,3.95,18.41,10.31,24.77 c6.36,6.36,15.13,10.31,24.77,10.31h0c9.64,0,18.41-3.95,24.77-10.31c6.36-6.36,10.31-15.13,10.31-24.77 c0-1.83,1.49-3.32,3.32-3.32s3.32,1.49,3.32,3.32c0,11.48-4.69,21.91-12.25,29.47C64.36,90.16,55.2,94.64,45.04,95.45L45.04,95.45z M41.94,0c6.38,0,12.18,2.61,16.38,6.81c4.2,4.2,6.81,10,6.81,16.38v30c0,6.38-2.61,12.18-6.81,16.38c-4.2,4.2-10,6.81-16.38,6.81 s-12.18-2.61-16.38-6.81c-4.2-4.2-6.81-10-6.81-16.38v-30c0-6.38,2.61-12.18,6.81-16.38C29.76,2.61,35.56,0,41.94,0L41.94,0z M53.62,11.51c-3-3-7.14-4.86-11.68-4.86c-4.55,0-8.68,1.86-11.68,4.86c-3,3-4.86,7.14-4.86,11.68v30c0,4.55,1.86,8.68,4.86,11.68 c3,3,7.14,4.86,11.68,4.86c4.55,0,8.68-1.86,11.68-4.86c3-3,4.86-7.14,4.86-11.68v-30C58.49,18.64,56.62,14.51,53.62,11.51 L53.62,11.51z"/></g></svg>
                </button>

                <button class="submit-question-btn">
                   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M13 18v-8l3.5 3.5l1.42-1.42L12 6.16l-5.92 5.92L7.5 13.5L11 10v8h2M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2Z"/></svg>
                </button>

               
             </div>
        </div>
    </div>
`


sendQuestion(document.querySelector('.submit-question-btn'))
handleBotClick()

handleUploadFile(document.querySelector('.upload-file'))
handlePastedFile()
handleVoiceRecord()
const inputMsg = document.querySelector('.inputMsg')


toggleSendIcon()

inputMsg.addEventListener('input', toggleSendIcon)


function toggleSendIcon(){
const sendBtn = document.querySelector('.submit-question-btn')

if(inputMsg.value){
sendBtn.classList.add('show')
}else{
 sendBtn.classList.remove('show')  
}
}