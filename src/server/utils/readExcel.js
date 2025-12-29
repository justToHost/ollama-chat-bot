
import XLSX from "xlsx"
import path from "path"
import { __dirname } from "../relativePath.js";
import fs from "fs"
import csv from "csv-parser";



let allText = '';
const filesPath = path.join(__dirname, 'excelFiles')
const tasneef_codes_workbook = 
XLSX.readFile(filesPath +  '/tasneef codes.xlsx')
const location_codes_workbook = 
XLSX.readFile(filesPath +  '/provinces locations code.xlsx')
const csvTasnif = path.join(filesPath,'tasneef_codes.csv')
const csvLocation = path.join(filesPath,'location_codes.csv')


// converting the excel file to csv lightweight and text based file

const tasnif_csv = toCsv(tasneef_codes_workbook,filesPath + '/tasneef_codes.csv');
const location_csv = toCsv(location_codes_workbook, filesPath + '/location_codes.csv');


function toCsv(workbook, csDest) {
   XLSX.writeFile(workbook, csDest || 'output.csv', 
   {bookType: 'csv'})
}

const tasnifJson = []
const locationJson = []


function readCsvFile(filePath, jsonArray){
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => jsonArray.push(data))
        .on('end', () => resolve())
        .on('error', (error) => reject(error))
    })
}

// const tasneefSheet = tasneef_codes_workbook.Sheets[tasneef_codes_workbook.SheetNames[0]]
// const locationSheet = location_codes_workbook.Sheets[location_codes_workbook.SheetNames[0]]

// const tasnifJson = XLSX.utils.sheet_to_json(tasneefSheet);
// const locationJson = XLSX.utils.sheet_to_json(locationSheet);

console.log( 'tasnif length : ', tasnifJson.length, ' location length ', locationJson.length)

   //  function getExcelFile(file){
   //      file.SheetNames.forEach(sheetName => {
   //      const sheet = file.Sheets[sheetName];
   //      const jsonData = XLSX.utils.sheet_to_json(sheet);
    
   //      allText += `\n=== SHEET: ${sheetName} ===\n`;
   //      allText += JSON.stringify(jsonData, null, 2) + '\n';
   //  });
   //     return allText
   //  }

await readCsvFile(csvTasnif, tasnifJson);
await readCsvFile(csvLocation, locationJson);



    export {tasnifJson as default, locationJson}