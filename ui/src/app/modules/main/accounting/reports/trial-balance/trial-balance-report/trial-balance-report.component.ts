import { Component, OnInit } from '@angular/core';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { exportTrialBalanceAsXLSX } from '@fboutil/export-xlsx.util';

interface TBFlatNode extends TrialBalanceItem {
  expandable: boolean;
  level: number;
  sclass: string;
}

@Component({
  selector: 'app-trial-balance-report',
  templateUrl: './trial-balance-report.component.html',
  styleUrls: [ './trial-balance-report.component.scss', '../../../../../../util/styles/fbo-table-style.scss' ]
})
export class TrialBalanceReportComponent implements OnInit {

  tableHeader = 'Trial Balance Report';

  displayedColumns: string[] = [ 'name', 'obDebit', 'obCredit', 'debit', 'credit', 'closeDebit', 'closeCredit' ];

  loading = true;

  private transformer = (node: TrialBalanceItem, level: number) => ({
    expandable: Boolean(node.children) && node.children.length > 0,
    ...node,
    level,
    sclass: '',
  })

  treeControl = new FlatTreeControl<TBFlatNode>(
    (node) => node.level, (node) => node.expandable);

treeFlattener = new MatTreeFlattener(
  this.transformer, (node) => node.level, (node) => node.expandable, (node) => node.children);

dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

constructor(private accountingReportService: AccountingReportService) {}


ngOnInit(): void {

  const userS = localStorage.getItem(LOCAL_USER_KEY);
  const sessionUser: SessionUser = JSON.parse(userS);
  const {finYear} = sessionUser;
  const startDate = dayjs(finYear.startDate).format('YYYY-MM-DD');
  const endDate = dayjs(finYear.endDate).format('YYYY-MM-DD');
  this.tableHeader = `Trial balance between ${startDate} and ${endDate}`;
  this.accountingReportService.fetchTrialBalanceItems(startDate, endDate).subscribe((plItems) => {

    this.dataSource.data = plItems;
    this.loading = false;

  });

}

handleExColClick = (node: TBFlatNode): void => {

  this.treeControl.toggle(node);
  node.sclass = this.treeControl.isExpanded(node) ? 'expanded-node' : '';

}

hasChild = (_nouse: number, node: TBFlatNode): boolean => node.expandable;

exportExcel(): void {

  const rows:Array<Array<string|number>> = [];
  for (const node of this.treeControl.dataNodes) {

    const {name, obDebit, obCredit, debit, credit, closeDebit, closeCredit} = node;
    const fName = new Array(node.level + 1).join('  ') + name;
    if (node.children?.length) {

      rows.push([ fName ]);

    } else {

      const row:Array<string|number> = [ fName ];
      row.push(obDebit ? obDebit : '');
      row.push(obCredit ? obCredit : '');
      row.push(debit ? debit : '');
      row.push(credit ? credit : '');
      row.push(closeDebit ? closeDebit : '');
      row.push(closeCredit ? closeCredit : '');
      rows.push(row);

    }

  }
  const userS = localStorage.getItem(LOCAL_USER_KEY);
  const sessionUser: SessionUser = JSON.parse(userS);
  const {finYear, company, branch} = sessionUser;
  const titles: string[] = [ this.tableHeader, `Company : ${company.name}`, `Branch : ${branch.name}`, `Financial Year : ${finYear.name}` ];
  exportTrialBalanceAsXLSX(titles, rows);

}

}

