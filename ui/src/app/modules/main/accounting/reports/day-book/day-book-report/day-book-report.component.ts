import { Component, OnInit } from '@angular/core';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
import { DayBookItem } from '@shared/util/day-book-item';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';

interface TBFlatNode extends DayBookItem {
  expandable: boolean;
  level: number;
  sclass: string;
}
@Component({
  selector: 'app-day-book-report',
  templateUrl: './day-book-report.component.html',
  styleUrls: [ './day-book-report.component.scss' ]
})
export class DayBookReportComponent implements OnInit {


  dataSrc = [];

  tableHeader = 'Day Book';

  displayedColumns: string[] = [ 'ledgerName', 'date', 'type', 'number', 'credit', 'debit' ];

  loading = true;

  columnHeaders = {
    ledgerName: 'LedgerName',
    date: 'Date',
    type: 'Type',
    number: 'Number',
    credit: 'Credit',
    debit: 'Debit'
  };

  private transformer = (node: DayBookItem, level: number) => ({
    expandable: Boolean(node.children) && node.children.length > 0,
    ledgerName: node.ledgerName,
    date: node.date,
    type: node.type,
    number: node.number,
    credit: node.credit,
    debit: node.debit,
    level,
    sclass: '',
  })

  treeControl = new FlatTreeControl<TBFlatNode>(
    (node) => node.level, (node) => node.expandable);

treeFlattener = new MatTreeFlattener(
  this.transformer, (node) => node.level, (node) => node.expandable, (node) => node.children);

dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

constructor(private accountingReportService: AccountingReportService) { }

ngOnInit(): void {

  const userS = localStorage.getItem(LOCAL_USER_KEY);
  const sessionUser: SessionUser = JSON.parse(userS);
  const { finYear } = sessionUser;
  const startDate = dayjs(finYear.startDate).format('YYYY-MM-DD');
  const endDate = dayjs(finYear.endDate).format('YYYY-MM-DD');
  this.accountingReportService.fetchDayBookItems(startDate, endDate).subscribe((plItems) => {

    this.dataSource.data = plItems;
    this.loading = false;

  });

}

  handleExColClick = (node: TBFlatNode): void => {

    this.treeControl.toggle(node);
    node.sclass = this.treeControl.isExpanded(node) ? 'expanded-node' : '';

  }

  hasChild = (_nouse: number, node: TBFlatNode): boolean => node.expandable;

  nodeEditor():void {

    const temp = this.treeControl.dataNodes;
    let index = 0;
    const spacer:any[] = [];
    for (const value of temp) {

      value?.level === 0 && index !== 0 ? spacer.push({}) : '';
      index++;
      spacer.push(value);

    }
    this.dataSrc = spacer;


  }

  exportExcel(): void {

    this.nodeEditor();
    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));
    exportAsXLSX(this.tableHeader, this.dataSrc, headers);


  }

    exportPDF = () => {

    }

}
