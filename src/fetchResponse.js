
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
    const cleanContent = parseWithMarkers(text)
 console.log(cleanContent, 'clean content')
    const answer = cleanContent
    sendAndDisplayMessage(text,'systemMsg')
  }
}

function parseWithMarkers(text) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    const structured = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
            
            return { type: 'bold', content: part.slice(2, -2) };
        } else {
            return { type: 'normal', content: part };
        }
    }).filter(part => part.content.trim() !== ''); // Remove empty parts
    
    // Convert to HTML with actual bold tags
    let html = '';
    structured.forEach(part => {
        if (part.type === 'bold') {
            html += `<strong>${part.content}</strong>`; // 🎯 Actual bolding
        } else {
            html += part.content;
        }
    });
    
    return html;
}

export default fetchResponse
