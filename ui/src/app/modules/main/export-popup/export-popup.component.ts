import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  title = 'exportExcelInAngular';
  export: any = [];
  head: any;
  ti?: any[];

  constructor(
    private mainservice: MainService,
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

    const EXCEL_EXTENSION = '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('ProductSheet');
    const name = this.head.filename ;
    worksheet.columns = this.export.eheader;

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
    const t = this.head.title;
    const doc = new jsPDF();
    const col = this.export.header;
    const rows = this.export.rowData;


    autoTable(doc, {

  head: [col],
  body: rows, });

    doc.save(fn);
    }
}
