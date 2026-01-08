
import fs from "fs/promises"
import path from "path"
import { __dirname } from "../relativePath.js"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {PDFParse} = require('pdf-parse');


export const getDetailedDataForQuestion = async()=> {
  const fileBuffered = await fs.readFile(path.join(__dirname, '/pdfFiles/tpms.pdf'))
console.log(fileBuffered, 'buffer of pdf file')
const parser = new PDFParse({ data: fileBuffered }); // Use 'data' not 'url'

const text = await parser.getText()
  return text;

}