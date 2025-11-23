
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
    userMsgEl.innerHTML = formatMessage(message)

    document.querySelector('.chats-area').append(userMsgEl)
     
      scrollToBottom()
   }

   function scrollToBottom() {
    const chatsArea = document.querySelector('.chats-area');
    chatsArea.scrollTop = chatsArea.scrollHeight;
}


// Format the message with proper HTML
function formatMessage(text) {
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