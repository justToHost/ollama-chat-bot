import '../styles/style.css'
import { sendQuestion } from './handle-submit-message.js'
import handleBotClick from './handleBotClick.js'
import handleUploadFile from './handleUploadFile.js'
import handlePastedFile from './handlePastedFile.js'
import handleVoiceRecord from './handleVoiceRecord.js'
import {openNewConversationPage} from './handleNewConversation.js'
import handleNewConversation from './handleNewConversation.js'
import { loadBot } from './handleBotClick.js'
import newChatBtn from './newChatBtn.js'
import handleSendIconToggle from './handleSendIconToggle.js'
import { createNewConversation } from './handleNewConversation.js'

document.querySelector('#app').innerHTML = homeFirstLoad()


window.addEventListener('DOMContentLoaded', (e)=>{
     localStorage.clear()

let conversationId = localStorage.getItem('conversationId')

if(!conversationId){
  conversationId = openNewConversationPage()
}else{
  // load the existing chat
}

})



function homeFirstLoad(){
  return  `
    
     ${newChatBtn()}
      ${openNewConversationPage()}
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

