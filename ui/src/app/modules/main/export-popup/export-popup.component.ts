import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import JSPDF from 'jspdf';
import autoTable, { Column, RowInput } from 'jspdf-autotable';
import { MainService } from '../../../services/main.service';
import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: [ './export-popup.component.scss' ]
})
export class ExportPopupComponent implements OnInit {


  dataSource = new MatTableDataSource<unknown>([]);

  constructor(
    private mainservice: MainService,
    @Inject(MAT_DIALOG_DATA) public data: {items: Array<unknown>,
    displayedColumns: Array<string>,
    columnHeaders: Record<string, string>,
    fileName: string;
    columnParsingFn?: (elm:unknown, clm:string)=>string} & Record<string, unknown>) { }

  findColumnValue = _findColumnValue;

  ngOnInit(): void {

    this.dataSource.data = this.data.items;

  }

  exportExcel(): void {


    const EXCEL_EXTENSION = '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet();
    const name = this.data.fileName;

    worksheet.getCell('A1', 'n').value = [name, name].join('\n');
    worksheet.getCell('A1').font = {
      size: 12,
      bold: true
    };
    const rownumber = 2;
    worksheet.mergeCells(1, 1, rownumber, this.data.cell as number);

    worksheet.getCell('A1').alignment = {vertical: 'middle',
      horizontal: 'center' };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.addRow(this.data.rheader, 'n');
    worksheet.columns = this.data.eheader as Array<Partial<Column>>;
    const headerrownumber = 3;
    worksheet.getRow(headerrownumber).font = {bold: true };
    worksheet.getRow(headerrownumber).alignment = {horizontal: 'center' };

    (this.data.items as Array<unknown>).forEach((element) => {

      const dispVals:Array<unknown> = [];
      for(const headerC of this.data.eheader as Array<Record<string, string>>){
        const columnKey = headerC['key'];
        const columnVal = this.findColumnValue(element, columnKey, this.data.columnParsingFn);
        dispVals.push(columnVal);
      }
      
      worksheet.addRow(dispVals, 'n');

    });


    workbook.xlsx.writeBuffer().then((data) => {

      const blob = new Blob([ data ]);

      saveAs(blob, name + EXCEL_EXTENSION);

    });

  }

  convert(): void {

    const doc = new JSPDF();
    const col = this.data.header as RowInput;
    const rows = this.data.items as Array<RowInput>;
    const FontSize = 20;
    doc.setFontSize(FontSize);
    const headerhorizontal = 95;
    const headervertical = 10;
    doc.text(this.data.fileName, headerhorizontal, headervertical);

    autoTable(

      doc, {head: [ col ],
        body: rows, 
      didParseCell: (cData) => {
        const columnVal = this.findColumnValue(cData.row.raw, cData.column.dataKey.toString(), this.data.columnParsingFn);
        cData.cell.text = [columnVal];
      }});

    doc.save(this.data.fileName);

  }

}
