import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MainService } from '../../../services/main.service';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: [ './export-popup.component.scss' ]
})
export class ExportPopupComponent implements OnInit {

  dataSource = new MatTableDataSource<unknown>([]);
  title = 'exportExcelInAngular';
  export:any = []

  constructor(
    private mainservice: MainService,
    @Inject(MAT_DIALOG_DATA) public data: {items: Array<unknown>,
    displayedColumns: Array<string>,
    columnHeaders:Record<string, string>,
    columnParsingFn?: unknown}) { }

  findColumnValue = _findColumnValue;

  ngOnInit(): void {

    this.dataSource.data = this.data.items;

    console.log(this.data);

    this.mainservice.getExport().subscribe(result=>{
      console.log(result);
      this.export = result
    })
     this.mainservice.getExport().subscribe(result1=>{
      console.log(result1);
      this.export = result1
    
    })

  }
  exportExcel(): void {

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('ProductSheet');

    worksheet.columns = this.export.eheader;
console.log(this.export.eheader);
this.export.rowData.forEach((e: any) => {
  worksheet.addRow (e,'n');
});




console.log([this.export.rowData]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      FileSaver.saveAs(blob, 'Data.xlsx');
    });

  }

  convert(): void {

    const doc = new jsPDF();
    const col = this.export.header;
    const rows =this.export.rowData;


    autoTable(doc, {
  head: [col],
  body: rows, });

    doc.save('Test.pdf');
    }
}
