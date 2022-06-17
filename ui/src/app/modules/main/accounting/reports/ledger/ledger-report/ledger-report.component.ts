
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { FilterItem } from '../../../../directives/table-filter/filter-item';
import { FilterLedgerReportComponent } from '../filter-ledger-report/filter-ledger-report.component';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { SessionUser } from '@shared/util/session-user';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';

@Component({
  selector: 'app-ledger-report',
  templateUrl: './ledger-report.component.html',
  styleUrls: [ './ledger-report.component.scss' ]
})
export class LedgerReportComponent implements OnInit {

  tableHeader = 'Ledger Wise Summary Report';

  displayedColumns: string[] = [ 'number', 'date', 'type', 'name', 'debit', 'credit', 'details' ];

  sortDisabledColumns: string[] = [ 'date' ];

  numberColumns: string[] = [ 'debit', 'credit', 'opening', 'balance' ];

  columnHeaders = {
    number: 'Voucher #',
    type: 'Type',
    date: 'Date',
    details: 'Details',
    name: 'Ledger',
    debit: 'Debit',
    credit: 'Credit',
    opening: 'Opening',
    balance: 'Balance'
  };

  queryParams: QueryData = {};

  loading = true;

  deleteUri: string = null;

  editUri: string = null;

  ledgerRows: ListQueryRespType<LedgerReportItem | TrialBalanceItem> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
              private accountingReportService: AccountingReportService,
              private router: Router) { }


  private fillLedgerSummaryReport = (ason: string) => {

    this.loading = true;
    this.accountingReportService.fetchLedgerSummaryReportItems(ason).subscribe((items) => {

      this.tableHeader = 'Ledger Wise Summary Report';
      this.editUri = '/reports/ledger';
      this.deleteUri = null;
      this.displayedColumns = [ 'name', 'debit', 'credit', 'opening', 'balance' ];
      this.ledgerRows = {
        items,
        totalItems: items.length,
        pageIndex: 0
      };
      this.loading = false;

    });

  }

  private fillLedgerReport = (ason: string, whereS: string) => {

    this.loading = true;
    this.displayedColumns = [ 'number', 'date', 'type', 'name', 'debit', 'credit', 'details' ];
    this.deleteUri = '/voucher/delete';
    this.editUri = '/voucher/edit';
    this.queryParams.where = JSON.parse(whereS);
    const ledgerParam = this.queryParams.where['transactions.ledgerId'] as {like: string};
    const againstParam = this.queryParams.where.againstL as {ne: string};
    const ledgerId = ledgerParam?.like;
    const againstId = againstParam?.ne;
    this.accountingReportService.fetchLedgerReportItems(ason, ledgerId, againstId).subscribe((items) => {

      this.ledgerRows = {
        items,
        totalItems: items.length,
        pageIndex: 0
      };
      this.loading = false;

    });

  }

  ngOnInit(): void {

    const userS = localStorage.getItem(LOCAL_USER_KEY);
    const sessionUser: SessionUser = JSON.parse(userS);
    const {finYear} = sessionUser;
    const asonT = dayjs(finYear.endDate).format('YYYY-MM-DD');

    this.filterItem = new FilterItem(FilterLedgerReportComponent, {});


    this.activatedRoute.queryParams.subscribe((value) => {

      const { id, whereS, order, ...qParam } = value;
      if (id) {

        this.router.navigate([ '/reports/ledger' ], { queryParams: {whereS: `{"transactions.ledgerId":{"like":"${id}","options":"i"}}`} });
        return;

      }
      this.queryParams = qParam;
      if (typeof order === 'string') {

        this.queryParams.order = [ order ];

      } else {

        this.queryParams.order = order;

      }
      const where: Record<string, Record<string, unknown>> = JSON.parse(whereS ?? '{}');
      const ason = <string>where?.date?.lte ?? asonT;
      if (where?.['transactions.ledgerId']) {

        this.fillLedgerReport(ason, whereS);

      } else {

        this.fillLedgerSummaryReport(ason);

      }

    });

  }

  columnParsingFn = (element: unknown, column: string): string => {

    if (!element[column]) {

      return null;

    }
    switch (column) {

    case 'date':
      return dayjs(element[column]).format(environment.dateFormat);

    }

    return null;

  }


  exportExcel(): void {

  }

  convert(): void {


  }

}
