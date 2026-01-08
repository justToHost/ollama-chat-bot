
import db from "../DB/seed.js"

export const createMessage = (conversationId, role, content)=>{

   console.log(conversationId, role, content, 'new conversation')
 try{
   const message = db.prepare(`INSERT INTO messages 
    (conversation_id,role,content)
     VALUES(?, ? , ?)
    `).run(conversationId,role,content)

    return message

 }catch(err){
  console.log(err)
  throw err
 }

}