import '/styles/style.css'
import { sendQuestion } from './handle-submit-message.js'
import handleUploadFile from './handleUploadFile.js'
import handlePastedFile from './handlePastedFile.js'
import handleVoiceRecord from './handleVoiceRecord.js'
import {firstChatPageLoad} from './handleNewConversation.js'
import handleNewConversation from './handleNewConversation.js'
import newChatBtn from './newChatBtn.js'
import handleSendIconToggle from './handleSendIconToggle.js'
import loadPrevMessages from './loadPrevMessages.js'
import { scrollToBottom } from './handle-submit-message.js'
import handleChatLanguage from './handleChatLanguage.js'

import navbar from './navbar.js'

document.querySelector('#app').innerHTML = homeFirstLoad()


// starting a fresh conversation  
if(performance.getEntriesByType('navigation')[0].type === 'navigate'){
  const conversationId = localStorage.getItem('conversationId')
      conversationId && localStorage.removeItem('conversationId')
}

window.addEventListener('DOMContentLoaded', async(e)=>{
   localStorage.setItem('isFirstLoad', 'true')
   const conversationId = localStorage.getItem('conversationId')
   let chatArea = document.querySelector('.chats-area')

   console.log(chatArea, 'chat area')
   scrollToBottom()

   if(!conversationId){
    chatArea.innerHTML = 
      `<p class="systemMsg static_msg"> How can i help you ?</p>`

   }else{
      scrollToBottom()
      await loadPrevMessages(conversationId,chatArea)
   }
})


function homeFirstLoad(){
  return  `
    
  <main>
    ${navbar()}
      ${firstChatPageLoad()}
  </main>
`
}

sendQuestion(document.querySelector('.submit-question-btn'))

handleUploadFile(
  document.querySelector('.upload-file'),
  document.querySelector('.submit-question-btn'),
  document.querySelector('.chat-input-panel'),

)
handlePastedFile(
  document.querySelector('.inputMsg'), 
document.querySelector('.submit-question-btn')
)
handleVoiceRecord()
handleNewConversation(
document.querySelector('.new')
)
 console.log(handleChatLanguage())


handleSendIconToggle(
document.querySelector('.inputMsg'), 
document.querySelector('.submit-question-btn')
)

