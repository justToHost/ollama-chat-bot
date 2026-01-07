
const handleSendIconToggle = (inputMsg,sendBtn) => {
 inputMsg.addEventListener('input', async()=>{
    console.log('input message input triggered ')
    toggleSendIcon(inputMsg,sendBtn)
    
 })
}

function toggleSendIcon(input,sendBtn){
   
    if(input.value){
       
    sendBtn.classList.add('show')
    }else{
    sendBtn.classList.remove('show')  
    }
}

export {handleSendIconToggle as default, toggleSendIcon }