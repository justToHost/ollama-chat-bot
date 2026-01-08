
import db from "../DB/seed.js"

export const currentChatHistory = (conversationId)=>{
  const currentConversationMessages = 
     db.prepare(`
      SELECT content from messages WHERE conversation_id = ?`)
      .all(conversationId)

      return currentConversationMessages
}