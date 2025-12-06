
import axios from "axios"
import { sendAndDisplayMessage } from "./handle-submit-message"


const fetchResponse = async(userQuestion) => {

   createMessageLoading()

  const response = await axios.post('/api/submitQuestion', {question:userQuestion})

   console.log(response, 'response')

  if(response.status === 200 && response.data.success){

    document.querySelector('.thinking').remove()
    const text = response.data.answer
    console.log('text answer from server ', text)

    const lang = response.data.lang

    sendAndDisplayMessage(text,'systemMsg', lang)
  }
}

function createMessageLoading(){
  const El = document.createElement('p')
  El.classList.add('systemMsg', 'thinking','message')

  El.textContent = "thinking..."
  document.querySelector('.chats-area').append(El)
  
}



export default fetchResponse
