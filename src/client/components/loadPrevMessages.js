import axios from 'axios'
import formatMessage from './handle-submit-message.js'
import getBaseUrl from './baseUrl.js'
import { createMessage } from './handle-submit-message.js'
import { feedBackUI } from './handle-submit-message.js'

const baseUrl = getBaseUrl()

export default async function loadPrevMessages(conversationId,chatArea){
  const response = await axios.get(`${baseUrl}/api/conversation/${conversationId}/messages`)

    if(response.status === 200){
       console.log('response code ',response)

       chatArea.innerHTML = ''
       const messages = response.data.messages
       
       const lastmessage = messages[messages.length - 1];
      
       messages.map(message =>{
        chatArea.innerHTML += displayPrevousMessagesUi(message, lastmessage)    
    })
    }
}

function displayPrevousMessagesUi(message, lm){

  console.log('last message ', lm)
  
       const farmattedMsg = formatMessage(message.content)
        let className = message.role === 'user' ? 'user-message' : 'systemMsg'

    return  `
      <div class=" ${className} message">
        
      ${message.id === lm.id ? `<p>${farmattedMsg} ${feedBackUI()}</p> ` : 
      `<p>${farmattedMsg}</p>`}

      </div>
    ` 

      
}


function isLastMessage(messages,message){
  
   return message.id === messages[messages.length - 1].id
}