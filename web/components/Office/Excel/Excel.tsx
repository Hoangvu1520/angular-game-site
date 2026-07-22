import * as XLSX from "xlsx";

interface sheet {
  data: any;
  nameSheet?: string;
  headerMapping?: any;
}
export type ExcelExportProps = {
  excel: sheet[];
  nameFile?: string;
};
const exportExcel = (ExcelProps: ExcelExportProps) => {
  const wb = XLSX.utils.book_new();
  ExcelProps.excel &&
    ExcelProps.excel.length > 0 &&
    ExcelProps.excel.map((sheet: any, key: number) => {
      var newData: any = [];
      var newHeader: any = [];
      if (sheet.headerMapping) {
        sheet.data.forEach((element: any) => {
          var newObj = {};
          for (const item in sheet.headerMapping) {
            newObj = {
              ...newObj,
              [sheet.headerMapping[item]]: element[item],
            };
          }
          newData = [...newData, newObj];
        });
        for (const item in sheet.headerMapping) {
          newHeader = [...newHeader, sheet.headerMapping[item]];
        }
      }

      const ws = XLSX.utils.json_to_sheet(
        sheet.headerMapping ? newData : sheet.data,
        sheet.headerMapping && {
          header: newHeader,
        }
      );
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        sheet.nameSheet ? sheet.nameSheet : "sheet" + `${key + 1}`
      );
    });

  XLSX.writeFile(
    wb,
    ExcelProps.nameFile ? ExcelProps.nameFile + ".xlsx" : "data.xlsx"
  );
};
export default exportExcel;
