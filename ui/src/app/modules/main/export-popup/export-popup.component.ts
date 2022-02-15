import { Component, Inject, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import * as Excel from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: [ './export-popup.component.scss' ]
})
export class ExportPopupComponent implements OnInit {
  [x: string]: any;

  dataSource = new MatTableDataSource<unknown>([]);


  constructor(@Inject(MAT_DIALOG_DATA) public data: {items: Array<unknown>,
    displayedColumns: Array<string>,
    columnHeaders: Record<string, string>,
    columnParsingFn?: unknown}) { }


    @ViewChild('epltable', { static: false }) epltable: ElementRef;

  findColumnValue = _findColumnValue;


  ngOnInit(): void {



    this.dataSource.data = this.data.items;
    console.log(this.data);

  }


  exportExcel(): void {

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('ProductSheet');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 40 },
      { header: 'Code', key: 'code', width: 15 },
      { header: 'Ledger Group', key: 'ledgerGroup.name', width: 19 },
      { header: 'Openning Balance', key: 'obAmount', width: 19 },
      { header: 'Openning Type', key: 'obType', width: 19 },
      { header: 'Details', key: 'details', width: 18 }
    ];

    this.data.items.forEach((e: any) => {
      worksheet.addRow({name: e.name ,
        code: e.code,
        'ledgerGroup.name': e.ledgerGroup.name,
        obAmount: e.obAmount,
        obType: e.obType,
        details: e.details }, 'n');
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      FileSaver.saveAs(blob, 'Data.xlsx');
    });

  }

  convert(): void {

    const doc = new jsPDF();
    const col = ['Name', 'Code', 'Ledger Group', 'Openning Balance', 'Opening Type', 'Details'];
    const rows = [];
    this.data.items.forEach((element: any) => {
    const temp = [element.name, element.code, element.ledgerGroup.name, element.obAmount, element.obType, element.details];

    rows.push(temp);



});

    autoTable(doc, {
  head: [col],
  body: rows, });

    doc.save('Test.pdf');
    }

}
