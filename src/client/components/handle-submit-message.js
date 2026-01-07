
import fetchResponse from "./fetchResponse.js"

import { toggleSendIcon } from "./handleSendIconToggle.js"
import { createNewConversation } from "./handleNewConversation.js"
import { marked } from "marked"

export function sendQuestion(element){

  let input = document.querySelector('.inputMsg')
  const inputPanel = document.querySelector('.chat-input-panel')
  const sendBtn = document.querySelector('.submit-question-btn')


   element.addEventListener('click', async(e)=>{
      await sendM(input, inputPanel)
   })

   document.addEventListener('keydown', async(e)=>{
      if(e.key === 'Enter') {

        if(sendBtn.disabled){
          // effect the enter key
          return sendBtn.style.border = '1px solid #000'
        }else{
           await sendM(input, inputPanel)
        }
        
       
      }
})
}


function deleteStaticMessage(){
   const staticMsg = chatArea.querySelector('.static_msg')
   staticMsg.remove()
}


const sendM = async(input,inputPanel)=>{
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
    const conversationId = localStorage.getItem('conversationId')
    if(!conversationId) {
        await createNewConversation('New Conversation')
    }

    await fetchResponse(inputMessage)

    input.value = ''
    sessionStorage.removeItem('parsedText')
    document.querySelector('#preview').innerHTML = ''
    toggleSendIcon(
      document.querySelector('.inputMsg'), 
      document.querySelector('.submit-question-btn')
    )
}


function sendAndDisplayMessage(chatData,classes, lang = null){
    const userMsgEl = createMessage(chatData,classes, lang = null)
    
    document.querySelector('.chats-area').append(userMsgEl)     
    scrollToBottom()
}

function scrollToBottom() {
const chatsArea = document.querySelector('.chats-area');
chatsArea.scrollTop = chatsArea.scrollHeight;
}

function createMessage(chat,classes, lang = null){
  
  const userMsgEl = document.createElement('div')
    userMsgEl.classList.add(classes, 'message')
    userMsgEl.style.direction = lang === null || (lang.includes('dari') || 
    lang.includes('pashto')) ? 'rtl' : 'ltr'
     userMsgEl.innerHTML = 
    classes === 'user-message' ?

      `${chat.image ?
          `
          ${chat.message ? 
            formatMessage(chat.message) : '' }
          <img class="message-image"  
            src="${chat.image ? chat.image : ''}" />
      `:`

            ${chat.message && `${formatMessage(chat.message)} ` }

        `}
        
        `
    :
      `${!chat.includes('thinking') ? 

        ` ${formatMessage(chat)} 
            ${feedBackUI()}
        ` 
        : 
        `${formatMessage(chat)}`}`

  return userMsgEl
}


function feedBackUI(){
  return `<small style="display:block; margin-top:5px; color: #555;">was it useful ? 
      <button class="feedback-btn" data-feedback="helpful">👍</button>
      <button class="feedback-btn" data-feedback="not-helpful">👎</button>
    </small>`
}

// Format the message with proper HTML
export default function formatMessage(text) {

 console.log('formatting message text ', text)
    return marked.parse(text)
}

export {sendAndDisplayMessage, scrollToBottom, createMessage, feedBackUI}