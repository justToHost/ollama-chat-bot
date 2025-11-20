
import fetchResponse from "./fetchResponse.js"
// import fixHeight from "./fixHeight.js"

export function sendQuestion(element){

   element.addEventListener('click', async()=>{
    let input = document.querySelector('.inputMsg')
    const inputMessage = input.value
    sendAndDisplayMessage(inputMessage, 'user-message')
    await fetchResponse(inputMessage)
    input.value = ''
   })
}

function sendAndDisplayMessage(message,classes){
    const userMsgEl = document.createElement('p')
    userMsgEl.classList.add(classes, 'message')
    userMsgEl.textContent = message

    document.querySelector('.chats-area').append(userMsgEl)
     
      scrollToBottom()
   }

   function scrollToBottom() {
    const chatsArea = document.querySelector('.chats-area');
    chatsArea.scrollTop = chatsArea.scrollHeight;
}


export {sendAndDisplayMessage}