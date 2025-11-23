

const handleBotClick = () => {
  const bot = document.querySelector('.bot')
bot.addEventListener('click', (e)=>{
    const container = document.querySelector('.container')
    container.classList.toggle('activate')
})
}

export default handleBotClick