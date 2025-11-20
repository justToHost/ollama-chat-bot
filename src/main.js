import './styles/style.css'
import { sendQuestion } from './handle-submit-message.js'
import handleBotClick from './handleBotClick.js'

document.querySelector('#app').innerHTML = `

  <div class="bot">Robot</div>

  <div class="container">
        <div class="chats-area"></div>

        <div class="chat-input-panel">
            <input class="inputMsg" type="text" placeholder="add your question">
            <button class="submit-question-btn">Send</button>
        </div>
    </div>
`


sendQuestion(document.querySelector('.submit-question-btn'))
handleBotClick()