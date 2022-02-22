import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import jsPDF from 'jspdf';
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
  [x: string]: any;

  dataSource = new MatTableDataSource<unknown>([]);
  title = 'exportExcelInAngular';
  export: any = [];
  head: any;


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



  this.mainservice.getExport().subscribe(result => {


      this.export = result;


    });
  this.mainservice.getExport().subscribe(result1 => {

      this.export = result1;


    });
  this.mainservice.getHd().subscribe(name => {

      this.head = name;
    });



  }
  exportExcel(): void {
    const array: Array<string> = [
       this.head.filename + ``,
      'Subheader:' + this.head.filename,

  ];

    const EXCEL_EXTENSION = '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet();
    const name = this.head.filename ;

    worksheet.getCell(`A1`, 'n').value = array.join('\n');
    worksheet.mergeCells('A1:G2');
    worksheet.getCell(`A1`).alignment = {vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`A2`).alignment = { horizontal: 'center' };


    if (this.router.url === '/voucher'){
      worksheet.addRow ( this.export.rheader, 'n');
      worksheet.columns = this.export.eheader;

   }
   else{
    worksheet.addRow ( this.export.eheader, 'n');

    worksheet.columns = this.export.wheader;

   }

    this.export.rowData.forEach((e: any) => {
  worksheet.addRow (e, 'n');
});


    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);

      saveAs(blob, name + EXCEL_EXTENSION);
    });

  }

  convert(): void {
    const fn = this.head.filename ;
    const doc = new jsPDF();
    const col = this.export.header;
    const rows = this.export.rowData;

    doc.setFontSize(20);
    doc.text(fn, 95, 10);



    autoTable(

      doc, {
  head: [col],
  body: rows, });

    doc.save(fn);
    }
}
