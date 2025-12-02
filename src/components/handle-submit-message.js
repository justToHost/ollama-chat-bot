
import fetchResponse from "./fetchResponse.js"
import { parseFile } from "./handleUploadFile.js"
import handlePastedFile from "./handlePastedFile.js"
import toggleSendIcon from "./main.js"


export function sendQuestion(element){

   element.addEventListener('click', async()=>{


    let input = document.querySelector('.inputMsg')
    const inputPanel = document.querySelector('.chat-input-panel')

    const pt = sessionStorage.getItem('parsedText')

    if(input.value  === '' && !pt ) return alert('please provide your question !')
        
    const parsedText = sessionStorage.getItem('parsedText')
    const userMessage =  input.value
    const inputMessage = parsedText ? parsedText + userMessage : userMessage

    const base64Img = inputPanel.querySelector('img') ? inputPanel.querySelector('img').src : null  

    const chatData = {
      image : base64Img,
      message : userMessage
    }


    sendAndDisplayMessage(chatData, 'user-message')
    await fetchResponse(inputMessage)
    input.value = ''
    sessionStorage.removeItem('parsedText')
    document.querySelector('#preview').innerHTML = ''
    toggleSendIcon()

   })
}

function sendAndDisplayMessage(chatData,classes){
  
    const userMsgEl = document.createElement('p')
    userMsgEl.classList.add(classes, 'message')
    userMsgEl.innerHTML = 
    
    classes === 'user-message' ?

      `${chatData.image ?
     `
     <p class="message-text">${chatData.message ? formatMessage(chatData.message) : '' }</p> 
     <img class="message-image" style="width: 80px; height : 50px;" 
       src="${chatData.image ? chatData.image : ''}" />
      `:`

        ${chatData.message ? formatMessage(chatData.message) : '' }

      `}
    `
    :
      `${!chatData.includes('thinking') ? 
  `${formatMessage(chatData)}
    <small style="display:block; margin-top:5px; color: #555;">was it useful ? 
      <button class="feedback-btn" data-feedback="helpful">👍</button>
      <button class="feedback-btn" data-feedback="not-helpful">👎</button>
    </small>
  ` 
  : formatMessage(chatData)}`

    document.querySelector('.chats-area').append(userMsgEl)
     
      scrollToBottom()
   }

   function scrollToBottom() {
    const chatsArea = document.querySelector('.chats-area');
    chatsArea.scrollTop = chatsArea.scrollHeight;
}


// Format the message with proper HTML
function formatMessage(text) {

 console.log('formatting message text ', text)
    return text
        // Convert line breaks to <br> first
        .replace(/\n/g, '<br>')
        // Boldify text surrounded by <br><br> (headers)
        .replace(/(<br><br>)([^<]+?)(<br><br>)/g, '$1<strong>$2</strong>$3')
        // Boldify text after double line breaks (before conversion)
        .replace(/(\n\n)([^\n]+?)(\n\n)/g, '$1<strong>$2</strong>$3')
        // Boldify numbered steps
        .replace(/(\d+\.\s+.+?)(?=<br>|$)/g, '<strong>$1</strong>')
        // Convert **bold** to <strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .trim()
}

export {sendAndDisplayMessage}