import '../styles/style.css'
import { sendQuestion } from './handle-submit-message.js'
import handleBotClick from './handleBotClick.js'
import handleUploadFile from './handleUploadFile.js'
import handlePastedFile from './handlePastedFile.js'
import handleVoiceRecord from './handleVoiceRecord.js'
import {firstChatPageLoad} from './handleNewConversation.js'
import handleNewConversation from './handleNewConversation.js'
import { loadBot } from './handleBotClick.js'
import newChatBtn from './newChatBtn.js'
import handleSendIconToggle from './handleSendIconToggle.js'



document.querySelector('#app').innerHTML = homeFirstLoad()


if(performance.getEntriesByType('navigation')[0].type === 'navigate'){
  const conversationId = localStorage.getItem('conversationId')
      conversationId && localStorage.removeItem('conversationId')
}

window.addEventListener('DOMContentLoaded', (e)=>{
   const conversationId = localStorage.getItem('conversationId')
   localStorage.setItem('isFirstLoad', 'true')
 
   console.log(conversationId,'conversation id')

   if(!conversationId){
    console.log('new conversation page loaded and the local sotrage is goaan be empty')
     firstChatPageLoad()
    
   }else{
    // load exising convesation with messages
   }
})




function homeFirstLoad(){
  return  `
    
     ${newChatBtn()}
      ${firstChatPageLoad()}
      ${loadBot()}
`
}


sendQuestion(document.querySelector('.submit-question-btn'))
handleBotClick(document.querySelector('.bot'))

handleUploadFile(document.querySelector('.upload-file'))
handlePastedFile()
handleVoiceRecord()
handleNewConversation(
document.querySelector('.newChatBtn')
)

handleSendIconToggle(
document.querySelector('.inputMsg'), 
document.querySelector('.submit-question-btn')
)

