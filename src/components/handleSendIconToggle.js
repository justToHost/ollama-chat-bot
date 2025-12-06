
const handleSendIconToggle = (inputMsg,sendBtn) => {
 inputMsg.addEventListener('input', ()=>{
    console.log('input message input triggered ')
    toggleSendIcon(inputMsg,sendBtn)
 })
}

function toggleSendIcon(inputMsg,sendBtn){
   
    if(inputMsg.value){
    sendBtn.classList.add('show')
    }else{
    sendBtn.classList.remove('show')  
    }
}

export {handleSendIconToggle as default, toggleSendIcon }