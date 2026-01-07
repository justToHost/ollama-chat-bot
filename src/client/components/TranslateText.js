
import axios from "axios"

export const translateT = async(text,from, to)=>{
    const question = `${encodeURIComponent(text)}&langpair=${from}|${to}`

    const translatedText = await axios.post(`https://api.mymemory.translated.net/get?q=$${question}`)

    return translatedText.data.responseData
}