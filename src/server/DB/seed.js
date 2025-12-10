import path from "path"
import { fileURLToPath } from "url"
import Database from "better-sqlite3"
import fileSys from "fs"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const db = new Database(path.join(__dirname, 'knowledgeBase.db'))

const sql = fileSys.readFileSync(path.join(__dirname, 'errors.sql'), 'utf-8')
db.exec(sql)

const faq_sql = 
fileSys.readFileSync(path.join(__dirname, 'faqs.sql'), 'utf-8')
db.exec(faq_sql)

const messages = 
fileSys.readFileSync(path.join(__dirname, 'messageHistory.sql'), 'utf-8')
db.exec(messages)

const conversations = fileSys.readFileSync(path.join(__dirname, 
'conversations.sql'), 'utf-8')
db.exec(conversations)

const UunknwError = 
db.prepare('SELECT COUNT(*) as totalErrors FROM unknown_errors').get();

const faqs = db.prepare(
    'SELECT COUNT(*) as faqsCount FROM faq_questions').get();

const hisMessagesLenth = 
db.prepare('SELECT COUNT(*) as messageHistory FROM messages').get();

//   db.prepare(
//     'DELETE FROM conversations').run();

//      db.prepare(
//     'DELETE FROM messages').run();

const conversationsCount = db.prepare(
    'SELECT COUNT(*) as conversations FROM conversations').get();

  

console.log('TOTAL UNKOW ERROS : ', UunknwError)
console.log('TOTAL faqs : ', faqs)
console.log('TOTAL messages : ', hisMessagesLenth)
console.log('conversation count : ', conversationsCount)

export default db