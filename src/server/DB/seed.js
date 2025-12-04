import path from "path"
import { fileURLToPath } from "url"
import Database from "better-sqlite3"
import fileSys from "fs"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const db = new Database(path.join(__dirname, 'knowledgeBase.db'))
// db.exec();
const sql = fileSys.readFileSync(path.join(__dirname, 'errors.sql'), 'utf-8')
db.exec(sql)

const faq_sql = 
fileSys.readFileSync(path.join(__dirname, 'faqs.sql'), 'utf-8')
db.exec(faq_sql)

const first4 = db.prepare('SELECT COUNT(*) as totalFaq FROM faq_questions').get();

const UunknwError = db.prepare('SELECT COUNT(*) as totalErrors FROM unknown_errors').get();



console.log('Total FAQs inserted: ', first4)
console.log('TOTAL UNKOW ERROS : ', UunknwError)

export default db