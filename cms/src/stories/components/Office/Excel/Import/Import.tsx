import * as XLSX from "xlsx";

// interface sheet {
//   data: any;
//   nameSheet?: string;
//   headerMapping?: any;
// }
export type ExcelImportProps = {
  excel: any;
};
const importExcel = (ExcelProps: Blob) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetJson = XLSX.utils.sheet_to_json(sheet);
  };
  reader.readAsBinaryString(ExcelProps);
};
export default importExcel;