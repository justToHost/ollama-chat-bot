import './styles/style.css'
import { sendQuestion } from './handle-submit-message.js'

document.querySelector('#app').innerHTML = `
  <div class="container">
        <div class="chats-area">
            <p class="systemMsg message">how could i help you ?</p>
            <p class="user-message message">create me a user </p>
        </div>

        <div class="chat-input-panel">
            <input class="inputMsg" type="text" placeholder="add your question">
            <button class="submit-question-btn">Send</button>
        </div>
    </div>
`


sendQuestion(document.querySelector('.submit-question-btn'))