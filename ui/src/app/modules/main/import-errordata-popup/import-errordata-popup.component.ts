import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-errordata-popup',
  templateUrl: './import-errordata-popup.component.html',
  styleUrls: [ './import-errordata-popup.component.scss' ]
})
export class ImportErrordataPopupComponent implements OnInit {

  dataSource = new MatTableDataSource<unknown>([]);

  constructor(private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {items: Array<unknown>,
    displayedColumns: Array<string>,
    columnHeaders: Record<string, string>,
    columnParsingFn?: unknown}) { }

    findColumnValue = _findColumnValue;

    ngOnInit(): void {

      this.dataSource.data = this.data.items;

    }

}
