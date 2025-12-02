
import toggleSendIcon from "./main"

const handleVoiceRecord = (e) => {
let recognition = null;
let isRecording = false;
let transcript = '';

    const recordBtn = document.querySelector('.record-voice-btn')

    if(!recordBtn) return console.log('record button not found')

    recordBtn.addEventListener('click', (e)=>{

        if(!isRecording){

         transcript = ''  // reset transcript for new recording
         
         recognition = new webkitSpeechRecognition()

          recognition.continuous = true;  // Keep listening until manually stopped
          recognition.interimResults = false;  // Only final results
          recognition.lang = 'fa-AF';  // Set language

         recognition.onstart = ()=>{
            console.log('voice recognition started. speak into the microphone')
             isRecording = true
             document.querySelector('.record-voice-btn').innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 61.34" style="enable-background:new 0 0 122.88 61.34" xml:space="preserve"><g><path d="M49.05,15.88c0-1.42,1.15-2.57,2.57-2.57s2.57,1.15,2.57,2.57v29.6c0,1.42-1.15,2.57-2.57,2.57s-2.57-1.15-2.57-2.57V15.88 L49.05,15.88L49.05,15.88z M73.83,15.88c0-1.42-1.15-2.57-2.57-2.57c-1.42,0-2.57,1.15-2.57,2.57v29.6c0,1.42,1.15,2.57,2.57,2.57 c1.42,0,2.57-1.15,2.57-2.57V15.88L73.83,15.88L73.83,15.88z M122.88,9.46c0-1.42-1.14-2.56-2.53-2.56c-1.4,0-2.53,1.14-2.53,2.56 v42.43c0,1.42,1.14,2.56,2.53,2.56c1.4,0,2.53-1.14,2.53-2.56V9.46L122.88,9.46L122.88,9.46z M113.11,2.57 c0-1.42-1.15-2.57-2.57-2.57s-2.57,1.15-2.57,2.57v56.2c0,1.42,1.15,2.57,2.57,2.57s2.57-1.15,2.57-2.57V2.57L113.11,2.57 L113.11,2.57z M83.65,21.66c0-1.42-1.15-2.57-2.57-2.57c-1.42,0-2.57,1.15-2.57,2.57v18.02c0,1.42,1.15,2.57,2.57,2.57 c1.42,0,2.57-1.15,2.57-2.57V21.66L83.65,21.66L83.65,21.66z M93.46,15.88c0-1.42-1.15-2.57-2.57-2.57c-1.42,0-2.57,1.15-2.57,2.57 v29.6c0,1.42,1.15,2.57,2.57,2.57c1.42,0,2.57-1.15,2.57-2.57V15.88L93.46,15.88L93.46,15.88z M103.25,9.46 c0-1.42-1.14-2.56-2.53-2.56c-1.4,0-2.53,1.14-2.53,2.56v42.43c0,1.42,1.14,2.56,2.53,2.56c1.4,0,2.53-1.14,2.53-2.56V9.46 L103.25,9.46L103.25,9.46z M0,9.46C0,8.05,1.14,6.9,2.53,6.9c1.4,0,2.53,1.14,2.53,2.56v42.43c0,1.42-1.14,2.56-2.53,2.56 C1.13,54.45,0,53.3,0,51.89V9.46L0,9.46L0,9.46z M9.78,2.57C9.78,1.15,10.93,0,12.35,0c1.42,0,2.57,1.15,2.57,2.57v56.2 c0,1.42-1.15,2.57-2.57,2.57c-1.42,0-2.57-1.15-2.57-2.57V2.57L9.78,2.57L9.78,2.57z M39.23,21.66c0-1.42,1.15-2.57,2.57-2.57 c1.42,0,2.57,1.15,2.57,2.57v18.02c0,1.42-1.15,2.57-2.57,2.57c-1.42,0-2.57-1.15-2.57-2.57V21.66L39.23,21.66L39.23,21.66z M29.42,15.88c0-1.42,1.15-2.57,2.57-2.57c1.42,0,2.57,1.15,2.57,2.57v29.6c0,1.42-1.15,2.57-2.57,2.57 c-1.42,0-2.57-1.15-2.57-2.57V15.88L29.42,15.88L29.42,15.88z M19.63,9.46c0-1.42,1.14-2.56,2.53-2.56c1.4,0,2.53,1.14,2.53,2.56 v42.43c0,1.42-1.14,2.56-2.53,2.56c-1.4,0-2.53-1.14-2.53-2.56V9.46L19.63,9.46L19.63,9.46z M58.9,9.46c0-1.42,1.14-2.56,2.53-2.56 c1.4,0,2.53,1.14,2.53,2.56v42.43c0,1.42-1.14,2.56-2.53,2.56c-1.4,0-2.53-1.14-2.53-2.56V9.46L58.9,9.46L58.9,9.46z"/></g></svg>'
         }
        
         recognition.onresult = (e)=>{
            console.log(e,e.resultIndex, 'result index')
           
           for(let i = e.resultIndex; i < e.results.length; i++){
            if(e.results[i].isFinal){
                transcript += e.results[i][0].transcript
            }


            console.log(transcript, 'interim transcript')
         }
         }

           recognition.onend = ()=>{
            console.log('voice recognition ended')
            isRecording = false

             console.log(transcript, 'final transcript')

             document.querySelector('.inputMsg').value += ' ' + transcript
             document.querySelector('.record-voice-btn').innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 83.44 122.88" style="enable-background:new 0 0 83.44 122.88" xml:space="preserve"><g><path d="M45.04,95.45v24.11c0,1.83-1.49,3.32-3.32,3.32c-1.83,0-3.32-1.49-3.32-3.32V95.45c-10.16-0.81-19.32-5.3-26.14-12.12 C4.69,75.77,0,65.34,0,53.87c0-1.83,1.49-3.32,3.32-3.32s3.32,1.49,3.32,3.32c0,9.64,3.95,18.41,10.31,24.77 c6.36,6.36,15.13,10.31,24.77,10.31h0c9.64,0,18.41-3.95,24.77-10.31c6.36-6.36,10.31-15.13,10.31-24.77 c0-1.83,1.49-3.32,3.32-3.32s3.32,1.49,3.32,3.32c0,11.48-4.69,21.91-12.25,29.47C64.36,90.16,55.2,94.64,45.04,95.45L45.04,95.45z M41.94,0c6.38,0,12.18,2.61,16.38,6.81c4.2,4.2,6.81,10,6.81,16.38v30c0,6.38-2.61,12.18-6.81,16.38c-4.2,4.2-10,6.81-16.38,6.81 s-12.18-2.61-16.38-6.81c-4.2-4.2-6.81-10-6.81-16.38v-30c0-6.38,2.61-12.18,6.81-16.38C29.76,2.61,35.56,0,41.94,0L41.94,0z M53.62,11.51c-3-3-7.14-4.86-11.68-4.86c-4.55,0-8.68,1.86-11.68,4.86c-3,3-4.86,7.14-4.86,11.68v30c0,4.55,1.86,8.68,4.86,11.68 c3,3,7.14,4.86,11.68,4.86c4.55,0,8.68-1.86,11.68-4.86c3-3,4.86-7.14,4.86-11.68v-30C58.49,18.64,56.62,14.51,53.62,11.51 L53.62,11.51z"/></g></svg>'

             toggleSendIcon()

         }

           recognition.start()

        } else {
            console.log('recording ongoing , stopping it now')
            recognition.stop()
            console.log('recording stopped')
        }

        recognition.onerror = (e)=>{
            console.log('error occurred in recognition: ' + e.error)
         }



       
    })

    }

export default handleVoiceRecord
