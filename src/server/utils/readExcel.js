
import XLSX from "xlsx"
import path from "path"
import { __dirname } from "../relativePath.js";

let allText = '';

const location_codes = XLSX.readFile(path.join(__dirname, 'excelFiles', 'provinces locations code.xlsx'))    
const tasneef_codes = 
XLSX.readFile(path.join(__dirname, 'excelFiles', 'tasneef codes.xlsx'))    
   
const tasneefSheet = tasneef_codes.Sheets[tasneef_codes.SheetNames[0]]
const locationSheet = location_codes.Sheets[location_codes.SheetNames[0]]

const tasnifJson = XLSX.utils.sheet_to_json(tasneefSheet);
const locationJson = XLSX.utils.sheet_to_json(locationSheet);

console.log( 'tasnif length : ', tasnifJson.length, ' location length ', locationJson.length)

    function getExcelFile(file){
        file.SheetNames.forEach(sheetName => {
        const sheet = file.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
    
        allText += `\n=== SHEET: ${sheetName} ===\n`;
        allText += JSON.stringify(jsonData, null, 2) + '\n';
    });
       return allText
    }


 const locationCodes = getExcelFile(location_codes)
    const tasnifCodes = getExcelFile(tasneef_codes)

    export {tasnifJson as default, locationJson}