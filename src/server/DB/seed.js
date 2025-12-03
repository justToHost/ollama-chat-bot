import path from "path"
import { fileURLToPath } from "url"
import Database from "better-sqlite3"
import fileSys from "fs"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const db = new Database(path.join(__dirname, 'knowledgeBase.db'),{ verbose: console.log })
// db.exec();
const sql = fileSys.readFileSync(path.join(__dirname, 'errors.sql'), 'utf-8')
const output = db.exec(sql)

const error1 = db.prepare('SELECT * FROM unknown_errors WHERE reference_code = $errorCode')
const row = error1.get({errorCode :  'ERR001'})

console.log('error from db ', row)

export default db