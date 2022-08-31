import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
import flat from 'flat';


const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;
const SIX = 6;
const SEVEN = 7;

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

export const exportTrialBalanceAsXLSX = (titles: string[], rows: Array<Array<string|number>>): void => {

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet();
  const header1 = [ 'Name', 'Opening Balance', '', 'Current Transactions', '', 'Closing Balance' ];
  const mLngh1 = header1.length + 1;
  titles.forEach((title, idx) => worksheet.addRow([ title ]) && worksheet.mergeCells(idx + 1, 1, idx + 1, mLngh1));
  const hRowStart = titles.length + 1;
  worksheet.addRow(header1);
  worksheet.addRow([ '', 'Debit', 'Credit', 'Debit', 'Credit', 'Debit', 'Credit' ]);
  worksheet.mergeCells(hRowStart, 1, hRowStart + 1, 1);
  worksheet.mergeCells(hRowStart, TWO, hRowStart, THREE);
  worksheet.mergeCells(hRowStart, FOUR, hRowStart, FIVE);
  worksheet.mergeCells(hRowStart, SIX, hRowStart, SEVEN);
  worksheet.addRows(rows);
  workbook.xlsx.writeBuffer().then((data) => {

    const blob = new Blob([ data ]);

    saveAs(blob, `${titles[0]}.xlsx`);

  });


};
