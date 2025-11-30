

const handleVoiceRecord = (e) => {

    const target = document.querySelector('.record-voice-btn')

    console.log(target)

    if(!target) return console.log('record button not found')

let isRecording = false;
    target.addEventListener('click', (e)=>{

        const recognition = new webkitSpeechRecognition()
         console.log(recognition, 'recognition class')


        if(isRecording){
            recognition.stop()
            isRecording = false
            console.log('record stopped !')
            return;
        }

         recognition.onresult = (e)=>{
            const transcript = e.results[0][0].transcript

            console.log(transcript)
         }

          console.log('recording...')
         recognition.start()
         isRecording = true

       
    })

    }

export default handleVoiceRecord
