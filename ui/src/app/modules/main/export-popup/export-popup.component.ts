import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';

@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: [ './export-popup.component.scss' ]
})
export class ExportPopupComponent implements OnInit {

  dataSource = new MatTableDataSource<unknown>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {items: Array<unknown>,
    displayedColumns: Array<string>,
    columnHeaders:Record<string, string>,
    columnParsingFn?: unknown}) { }

  findColumnValue = _findColumnValue;

  ngOnInit(): void {

    this.dataSource.data = this.data.items;
    console.log(this.data);

  }

}
