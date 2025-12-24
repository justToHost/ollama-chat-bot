
const navbar = () => {
  return `<nav>
      <div class="innerNav">
      <div class="left">
        <div class="logo">TPMS</div>
        <button class="new">new chat</button>

        <div class="languageSelect">
           <select name="lang" id="lang">
              <option value="dari AFG">Dari</option>
              <option value="pashto">Pashto</option>
              <option value="english">English</option>
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