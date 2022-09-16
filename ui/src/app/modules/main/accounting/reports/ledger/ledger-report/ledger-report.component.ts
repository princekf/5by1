
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
import { createXLSXBuffer, exportAsXLSX } from '@fboutil/export-xlsx.util';
import { SessionUser } from '@shared/util/session-user';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import * as saveAs from 'file-saver';
import * as JSZip from 'jszip';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';

@Component({
  selector: 'app-ledger-report',
  templateUrl: './ledger-report.component.html',
  styleUrls: [ './ledger-report.component.scss' ]
})
export class LedgerReportComponent implements OnInit {

  showDownloadAll = true;

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
              private ledgerService: LedgerService,
              private readonly ledgerGroupService: LedgerGroupService,
              private router: Router) { }


  private fillLedgerSummaryReport = (startDate: string, endDate: string) => {

    this.loading = true;
    this.accountingReportService.fetchLedgerSummaryReportItems(startDate, endDate).subscribe((items) => {

      this.tableHeader = `Ledger wise summary report between ${startDate} and ${endDate}`;
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

  private fillLedgerReport = (startDate: string, endDate: string, whereS: string) => {

    this.loading = true;
    this.displayedColumns = [ 'number', 'date', 'type', 'name', 'debit', 'credit', 'details' ];
    this.deleteUri = '/voucher/delete';
    this.editUri = '/voucher/edit';
    this.queryParams.where = JSON.parse(whereS);
    const ledgerParam = this.queryParams.where['transactions.ledgerId'] as {like: string};
    const againstParam = this.queryParams.where.againstL as {ne: string};
    const ledgerId = ledgerParam?.like;
    const againstId = againstParam?.ne;
    this.ledgerService.get(ledgerId, {}).subscribe((ldg) => (this.tableHeader = `Ledger Report - ${ldg.name} between ${startDate} and ${endDate}`));
    this.accountingReportService.fetchLedgerReportItems(startDate, endDate, ledgerId, againstId).subscribe((items) => {

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
    const endDateT = dayjs(finYear.endDate).format('YYYY-MM-DD');
    const startDateT = dayjs(finYear.startDate).format('YYYY-MM-DD');

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
      const [ stD, enD ] = (where?.date?.between ?? []) as string[];
      const endDate = enD ?? endDateT;
      const startDate = stD ?? startDateT;
      if (where?.['transactions.ledgerId']) {

        this.fillLedgerReport(startDate, endDate, whereS);
        this.showDownloadAll = false;

      } else {

        this.fillLedgerSummaryReport(startDate, endDate);
        this.showDownloadAll = true;

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

  findCssClassFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'number':
      const elm = element as {documents: Array<unknown>};
      if (elm?.documents?.length) {

        return 'has-attatchments';

      }

    }
    return null;

  }

  exportExcel(): void {

    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));
    exportAsXLSX(this.tableHeader, this.ledgerRows.items, headers);

  }


  fetchLedgerReport = (startDate: string, endDate: string, rItem:TrialBalanceItem):
  Observable<{items: Array<LedgerReportItem>,
  rItem: TrialBalanceItem}> => this.accountingReportService.fetchLedgerReportItems(startDate, endDate, rItem.id).pipe(
    map((items) => ({items,
      rItem}))
  )

  findFolderPath = (lgC: LedgerGroup, lgMap:Record<string, LedgerGroup>): string => {

    if (!lgC.parentId) {

      return lgC.name;

    }
    return `${this.findFolderPath(lgMap[lgC.parentId], lgMap)}/${lgC.name}`;

  }

  createFolderMap = async(zip: JSZip):Promise<Record<string, JSZip>> => {

    const lgs = await this.ledgerGroupService.search({}).toPromise();
    const folders:Record<string, JSZip> = {};
    const lgMap:Record<string, LedgerGroup> = {};
    lgs.forEach((lgC) => (lgMap[lgC.id] = lgC));
    for (const lgC of lgs) {

      const folderPath = this.findFolderPath(lgC, lgMap);
      folders[lgC.id] = zip.folder(`ledger-reports/${folderPath}`);

    }
    return folders;

  }

  downloadAll = async(): Promise<void> => {

    this.loading = true;
    const userS = localStorage.getItem(LOCAL_USER_KEY);
    const sessionUser: SessionUser = JSON.parse(userS);
    const {finYear} = sessionUser;
    const stD = dayjs(finYear.startDate).format('YYYY-MM-DD');
    const enD = dayjs(finYear.endDate).format('YYYY-MM-DD');
    const dispColumns = [ 'number', 'date', 'type', 'name', 'debit', 'credit', 'details' ];
    const headers = dispColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));
    const zip = new JSZip();
    const folders = await this.createFolderMap(zip);
    const tasks$:Array<Observable<{items: Array<LedgerReportItem>,
      rItem: TrialBalanceItem}>> = [];
    this.ledgerRows.items.forEach((item) => tasks$.push(this.fetchLedgerReport(stD, enD, <TrialBalanceItem>item)));
    forkJoin(tasks$).subscribe(async(dataDs) => {

      for (const dataD of dataDs) {

        const {items,
          rItem} = dataD;
        const tableHeader = `Ledger Report - ${rItem.name} between ${stD} and ${enD}`;
        const buffer = createXLSXBuffer(tableHeader, items, headers);
        const data = await buffer;
        folders[rItem.parentId]?.file(`${rItem.name}.xlsx`, data, {binary: true});

      }
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, 'ledger-reports.zip');
      this.loading = false;

    });

  };

}
