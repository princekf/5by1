import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';

export const exportAsXLSX = (title: string, items: Array<unknown>,
  headers:Array<{header: string, key: string}>): void => {

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet();
  worksheet.columns = headers;
  worksheet.addRows(items);
  workbook.xlsx.writeBuffer().then((data) => {

    const blob = new Blob([ data ]);

    saveAs(blob, `${title}.xlsx`);

  });

};
