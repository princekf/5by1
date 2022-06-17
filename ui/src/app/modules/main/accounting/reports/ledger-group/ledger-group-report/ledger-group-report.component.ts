import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { FilterItem } from '../../../../directives/table-filter/filter-item';
import { FilterLedgerGroupReportComponent } from '../filter-ledger-group-report/filter-ledger-group-report.component';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { SessionUser } from '@shared/util/session-user';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { LedgerReportItem } from '@shared/util/ledger-report-item';

@Component({
  selector: 'app-ledger-group-report',
  templateUrl: './ledger-group-report.component.html',
  styleUrls: [ './ledger-group-report.component.scss' ]
})
export class LedgerGroupReportComponent implements OnInit {

  tableHeader = 'Ledger Group Report';

  displayedColumns: string[] = [ 'number', 'date', 'type', 'primaryLedger', 'ledger', 'debit', 'credit', 'details' ];

  sortDisabledColumns: string[] = [ 'date' ];

  numberColumns: string[] = [ 'debit', 'credit', 'opening', 'balance' ];

  columnHeaders = {
    number: 'Voucher #',
    type: 'Type',
    date: 'Date',
    details: 'Details',
    primaryLedger: 'Primary Ledger',
    ledger: 'Ledger',
    debit: 'Debit',
    credit: 'Credit',
    pname: 'Primary Ledger',
    name: 'Name',
    obDebit: 'OB Debit',
    obCredit: 'OB Credit',
    balance: 'Balance',
    opening: 'Opening'
  };

  queryParams: QueryData = {};

  loading = true;

  ledgerRows: ListQueryRespType<TrialBalanceItem | LedgerReportItem> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  deleteUri: string = null;

  editUri: string = null;

  constructor(private activatedRoute: ActivatedRoute,
              private ledgerGroupService: LedgerGroupService,
              private accountingReportService: AccountingReportService,
              private router:Router) { }

  private loadData = (ason: string, ledgerGroupId: string) => {

    this.ledgerGroupService.get(ledgerGroupId, {}).subscribe((lGroup) => {

      this.tableHeader = `Ledger Group Report -- ${lGroup.name}`;

    });

    this.accountingReportService.fetchLedgerGroupReportItems(ason, ledgerGroupId).subscribe((items) => {

      this.ledgerRows = {
        items,
        totalItems: items.length,
        pageIndex: 0
      };
      this.loading = false;

    });

  }


  private loadSummary = (ason: string): void => {

    this.editUri = '/reports/ledger-group';
    this.deleteUri = null;
    this.displayedColumns = [ 'number', 'date', 'type', 'name', 'debit', 'credit', 'details' ];
    this.tableHeader = 'Ledger Group Summary Report';
    this.accountingReportService.fetchLedgerGroupSummaryReportItems(ason).subscribe((items) => {

      this.ledgerRows = {
        items,
        totalItems: items.length,
        pageIndex: 0
      };
      this.loading = false;

    });

  };

  private loadSingleLGroupDetails = (ason: string, whereS: string): void => {

    this.displayedColumns = [ 'number', 'date', 'type', 'pname', 'name', 'debit', 'credit', 'details' ];
    this.deleteUri = '/voucher/delete';
    this.editUri = '/voucher/edit';
    this.queryParams.where = JSON.parse(whereS);
    const ledgerGroupParam = this.queryParams.where.ledgerGroupId as {like: string};
    const ledgerGroupId = ledgerGroupParam?.like;
    this.loadData(ason, ledgerGroupId);

  }

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterLedgerGroupReportComponent, {});
    this.activatedRoute.queryParams.subscribe((value) => {

      const { id, whereS, order, ...qParam } = value;
      if (id) {

        this.router.navigate([ '/reports/ledger-group' ], { queryParams: {whereS: `{"ledgerGroupId":{"like":"${id}","options":"i"}}`} });
        return;

      }
      this.queryParams = qParam;
      if (typeof order === 'string') {

        this.queryParams.order = [ order ];

      } else {

        this.queryParams.order = order;

      }
      this.loading = true;
      const userS = localStorage.getItem(LOCAL_USER_KEY);
      const sessionUser: SessionUser = JSON.parse(userS);
      const {finYear} = sessionUser;
      const ason = dayjs(finYear.endDate).format('YYYY-MM-DD');

      if (whereS) {

        this.loadSingleLGroupDetails(ason, whereS);

      } else {

        this.loadSummary(ason);

      }

    });

  }

  columnParsingFn = (element: unknown, column: string): string => {

    if (!element[column]) {

      return ' ';

    }
    switch (column) {

    case 'date':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  exportExcel(): void {

  }

  exportPDF(): void {


  }


}
