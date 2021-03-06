import { Component, OnInit } from '@angular/core';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

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

  displayedColumns: string[] = [ 'name', 'credit', 'debit', 'opening', 'balance' ];

  loading = true;


  private transformer = (node: TrialBalanceItem, level: number) => ({
    expandable: Boolean(node.children) && node.children.length > 0,
    name: node.name,
    credit: node.credit,
    debit: node.debit,
    opening: node.opening,
    balance: node.balance,
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
  const {finYear} = sessionUser;
  const ason = dayjs(finYear.endDate).format('YYYY-MM-DD');
  this.accountingReportService.fetchTrialBalanceItems(ason).subscribe((plItems) => {

    this.dataSource.data = plItems;
    this.loading = false;

  });

}

handleExColClick = (node: TBFlatNode): void => {

  this.treeControl.toggle(node);
  node.sclass = this.treeControl.isExpanded(node) ? 'expanded-node' : '';
  
}

hasChild = (_nouse: number, node: TBFlatNode): boolean => node.expandable;

  exportExcel = () => {

  }

  exportPDF = () => {

  }

}

