import '../styles/style.css'
import { sendQuestion } from './handle-submit-message.js'
import handleBotClick from './handleBotClick.js'
import handleUploadFile from './handleUploadFile.js'
import handlePastedFile from './handlePastedFile.js'
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