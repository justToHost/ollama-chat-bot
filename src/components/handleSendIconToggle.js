import { createNewConversation } from "./handleNewConversation"

const handleSendIconToggle = (inputMsg,sendBtn) => {
 inputMsg.addEventListener('input', async()=>{
    console.log('input message input triggered ')
    toggleSendIcon(inputMsg,sendBtn)
    const conversationId = localStorage.getItem('conversationId')

    if(!conversationId) {
        await createNewConversation('New Conversation')
    }
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