import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
import flat from 'flat';

export const createXLSXBuffer = (title: string, items: Array<unknown>,
  headers:Array<{header: string, key: string}>): Promise<Excel.Buffer> => {

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet();
  worksheet.columns = headers;
  worksheet.addRows(items.map((row) => flat(row)));
  worksheet.insertRow(1, [ title ]);
  const endColumnIdx = worksheet.columnCount;
  worksheet.mergeCells(1, 1, 1, endColumnIdx);
  return workbook.xlsx.writeBuffer();

};

export const exportAsXLSX = (title: string, items: Array<unknown>,
  headers:Array<{header: string, key: string}>): void => {


  createXLSXBuffer(title, items, headers).then((data) => {

    const blob = new Blob([ data ]);

    saveAs(blob, `${title}.xlsx`);

  });

};
