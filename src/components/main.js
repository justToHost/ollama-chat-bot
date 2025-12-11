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
import { createTempConversation } from './handleNewConversation.js'


document.querySelector('#app').innerHTML = homeFirstLoad()


window.addEventListener('DOMContentLoaded', (e)=>{
const firstLoad = performance.getEntriesByType('navigation')[0].type === "navigate"

if(firstLoad){
  createTempConversation('New Chat')
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

