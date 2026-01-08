
import tpmsLogo from '../assets/tpms_logo.webp'

const navbar = () => {
  return `<nav>
      <div class="innerNav">
      <div class="left">
        <div class="logo">
           <img src="${tpmsLogo}">
        </div>
        <button class="new">new chat</button>

        <div class="languageSelect">
           <select name="lang" id="lang">
              <option value="prs">Dari</option>
              <option value="ps">Pashto</option>
              <option value="en">English</option>
            </select>
        </div>

      </div>

      <div class="right">
        <div class="new_question">
          <button class="addNewQuestion">Add New Question</button>
        </div>
      </div>
      </div>
    </nav>
  `
  
}

export default navbar