
import axios from "axios"
import { sendAndDisplayMessage } from "./handle-submit-message"


const fetchResponse = async(userQuestion) => {

  const loading = 'thinking...'
  sendAndDisplayMessage(loading,'systemMsg')
  const response = await axios.post('/api/submitQuestion', {question:userQuestion})

   console.log(response, 'response')

  if(response.status === 200 && response.data.success){
    console.log('proceed !')

    const text = response.data.answer
    console.log('text answer from server ', text)
    sendAndDisplayMessage(text,'systemMsg')
  }
}

export default fetchResponse
