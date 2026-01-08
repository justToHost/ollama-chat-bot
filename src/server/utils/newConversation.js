
import db from "../DB/seed.js"

export const createNewConversation = (title)=>{
 try{
   db.prepare('BEGIN').run()

  // new conversation
  const newConversation = db.prepare(`INSERT INTO conversations (title)
    VALUES(?)`)

    const info = newConversation.run(title)
    console.log(newConversation.columns.length, 'new one')

     db.prepare('COMMIT').run()

     const convs = db.prepare('SELECT * FROM conversations').all()

     console.log('all conversations ', convs)
     return info
 }catch(err){
  console.log(err)
      db.prepare('ROLLBACK')
      throw err
 }
}