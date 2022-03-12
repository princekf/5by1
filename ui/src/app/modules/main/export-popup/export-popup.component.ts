import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import JSPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MainService } from '../../../services/main.service';
import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
import { Router } from '@angular/router';
@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: [ './export-popup.component.scss' ]
})
export class ExportPopupComponent implements OnInit {


  dataSource = new MatTableDataSource<unknown>([]);

  title = 'exportExcelInAngular';

  exports;

  head;


  constructor(
    private mainservice: MainService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {items: Array<unknown>,
    displayedColumns: Array<string>,
    columnHeaders: Record<string, string>,
    columnParsingFn?: unknown}) { }

  findColumnValue = _findColumnValue;

  ngOnInit(): void {

    this.dataSource.data = this.data.items;


    this.mainservice.getExport().subscribe((result) => {


      this.exports = result;


    });
    this.mainservice.getExport().subscribe((result1) => {

      this.exports = result1;


    });
    this.mainservice.getHd().subscribe((name) => {

      this.head = name;

    });


  }

  exportExcel(): void {

    const array: Array<string> = [
      this.head.filename,
      this.head.filename,

    ];

    const EXCEL_EXTENSION = '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet();
    const name = this.head.filename;

    worksheet.getCell('A1', 'n').value = array.join('\n');
    worksheet.getCell('A1').font = {
      size: 12,
      bold: true
    };
    const rownumber = 2;
    worksheet.mergeCells(1, 1, rownumber, this.exports.cell);

    worksheet.getCell('A1').alignment = {vertical: 'middle',
      horizontal: 'center' };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.addRow(this.exports.rheader, 'n');
    worksheet.columns = this.exports.eheader;
    const headerrownumber = 3;
    worksheet.getRow(headerrownumber).font = {bold: true };
    worksheet.getRow(headerrownumber).alignment = {horizontal: 'center' };

    this.exports.rowData.forEach((element) => {

      worksheet.addRow(element, 'n');

    });


    workbook.xlsx.writeBuffer().then((data) => {

      const blob = new Blob([ data ]);

      saveAs(blob, name + EXCEL_EXTENSION);

    });

  }

  convert(): void {

    const fname = this.head.filename;
    const doc = new JSPDF();
    const col = this.exports.header;
    const rows = this.exports.rowData;
    const FontSize = 20;
    doc.setFontSize(FontSize);
    const headerhorizontal = 95;
    const headervertical = 10;
    doc.text(fname, headerhorizontal, headervertical);


    autoTable(

      doc, {head: [ col ],
        body: rows, });

    doc.save(fname);

  }

}
