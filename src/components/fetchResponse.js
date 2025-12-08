
import axios from "axios"
import { sendAndDisplayMessage } from "./handle-submit-message"


const fetchResponse = async(userQuestion) => {

   createMessageLoading()

  let toServer = null;
  const newTabOpened = appFirstLoad()
  console.log(newTabOpened)

  if(newTabOpened){

    toServer = 
    {
      newTab : true,
      question : userQuestion
    }
  }else{
  
    toServer = {
      question : userQuestion
    }

  }

  const response = 
  await axios.post('/api/submitQuestion', {toServer})

   console.log(response, 'response')

  if(response.status === 200 && response.data.success){

    document.querySelector('.thinking').remove()
    const text = response.data.answer
    console.log('text answer from server ', text)

    const lang = response.data.lang

    sendAndDisplayMessage(text,'systemMsg', lang)
  }
}


// app loaded fist

function appFirstLoad(){
  const navigated = performance.getEntriesByType('navigation')[0].type === 'navigate'
  const sessionActive = sessionStorage.getItem('tab_init')
  const emptyReferrer = window.history.length <= 2 && document.referrer === ''

  return navigated && emptyReferrer && !sessionActive
}


function createMessageLoading(){
  const El = document.createElement('p')
  El.classList.add('systemMsg', 'thinking','message')

  El.textContent = "thinking..."
  document.querySelector('.chats-area').append(El)
  
}



export default fetchResponse
