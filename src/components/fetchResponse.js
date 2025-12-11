
import axios from "axios"
import { sendAndDisplayMessage } from "./handle-submit-message"


const fetchResponse = async(userQuestion) => {

   createMessageLoading()
const questionData = {question : userQuestion}
const conversationId = localStorage.getItem('conversationId')

  const response = 
  await axios.post(`/api/submitQuestion?conversation_id=${conversationId}`, {questionData})

   console.log(response, 'response')

  if(response.status === 200 && response.data.success){

    document.querySelector('.thinking').remove()
    const text = response.data.answer
   
    console.log('text answer from server ', text)

    const lang = response.data.lang
    const newConv_id = response.data.conversationId

    localStorage.setItem('conversationId', newConv_id)

    console.log('new conversation id', newConv_id)
    sendAndDisplayMessage(text,'systemMsg', lang)
    
  }
}



// app loaded fist

function appFirstLoad(){
  const navigated = performance.getEntriesByType('navigation')[0].type === 'navigate'
  const emptyReferrer = window.history.length <= 2 && document.referrer === ''

  return navigated && emptyReferrer
}


function createMessageLoading(){
  const El = document.createElement('p')
  El.classList.add('systemMsg', 'thinking','message')

  El.textContent = "thinking..."
  document.querySelector('.chats-area').append(El)
  
}



export default fetchResponse
