import { Component, Input, OnInit } from '@angular/core';
import { ITableData } from './ITableData';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: [ './summary-table.component.scss' ]
})
export class SummaryTableComponent implements OnInit {

  @Input() tableData: ITableData;

  displayedColumns: string[];

  constructor() { }

  ngOnInit(): void {

    this.displayedColumns = Object.keys(this.tableData?.results[0]);

  }

}
