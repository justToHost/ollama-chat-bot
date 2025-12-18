import axios from 'axios'
import formatMessage from './handle-submit-message.js'

export default async function loadPrevMessages(conversationId,chatArea){
  const response = await axios.get(`/api/conversation/${conversationId}/messages`)

    if(response.status === 200){
       console.log('response code ',response)

       chatArea.innerHTML = ''
       const messages = response.data.messages
       
       messages.map(message =>
           chatArea.innerHTML+= displayPrevousMessagesUi(message)
           )
    }
}

function displayPrevousMessagesUi(message){

         const farmattedMsg = formatMessage(message.content)

      let className = message.role === 'user' ? 'user-message' 
      : 'systemMsg'

      return  `<p class=" ${className} message" >${farmattedMsg}</p>` 
}