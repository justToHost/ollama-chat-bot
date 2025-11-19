
import fetchResponse from "./fetchResponse.js"

export function sendQuestion(element){

   element.addEventListener('click', async()=>{
    const inputMessage = document.querySelector('.inputMsg').value
    sendAndDisplayMessage(inputMessage, 'user-message')
    await fetchResponse(inputMessage)
   })
}

function sendAndDisplayMessage(message,classes){
    console.log(message, classes)

    const userMsgEl = document.createElement('p')
    userMsgEl.classList.add(classes, 'message')
    userMsgEl.innerText = message

    document.querySelector('.chats-area').append(userMsgEl)
   }

export {sendAndDisplayMessage}