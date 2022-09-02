import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher, VoucherType } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { forkJoin} from 'rxjs';
import { FilterItem } from 'src/app/modules/main/directives/table-filter/filter-item';
import { FilterVoucherComponent } from '../filter-voucher/filter-voucher.component';
import { MainService } from '@fboservices/main.service';

type VType = Voucher & { amount: string; pledger: string; cledger: string; };

@Component({
  selector: 'app-list-voucher',
  templateUrl: './list-voucher.component.html',
  styleUrls: [ './list-voucher.component.scss' ]
})
export class ListVoucherComponent implements OnInit {

  @Input() voucherType: VoucherType;

  @Input() editUri: string;

  @Input() tableHeader: string;

  displayedColumns: string[] = [ 'number', 'date', 'pledger.name', 'cledger.name', 'amount', 'details' ];

  numberColumns: string[] = [ 'amount' ];

  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    'pledger.name': 'Primary Ledger',
    'cledger.name': 'Compound Ledger',
    amount: 'Amount',
    details: 'Details',
    'pledger.code': 'Primary Ledger Code',
    'cledger.code': 'Compound Ledger Code',
  };

  xheaders = [

    { key: 'number',
      width: 30, },
    { key: 'date',
      width: 30, },
    { key: 'pledger.name',
      width: 30, },
    { key: 'pledger.code',
      width: 30, },
    { key: 'cledger.name',
      width: 30, },
    { key: 'cledger.code',
      width: 30, },
    { key: 'amount',
      width: 30, },
    { key: 'details',
      width: 30 }
  ];

  queryParams: QueryData = {};


  loading = true;

  vouchers: ListQueryRespType<VType> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(private activatedRoute: ActivatedRoute,
              private voucherService: VoucherService,
              private mainservice: MainService) { }


  private formatItems = (ledgerMap: Record<string, Ledger>, items: Array<Voucher>): Array<VType> => {

    const table = this.tableHeader;
    let tempDate: string = null;
    const itemsT = [];
    const maxLength = 20;
    const trimLength = 17;
    for (const item of items) {

      if (item.date !== null) {

        if (localStorage.getItem('currentDate') === null) {

          tempDate = dayjs(item.date).utc(true)
            .format();
          localStorage.setItem('currentDate', tempDate);

        }

      }
      const [ firstTr, secondTr ] = item.transactions;
      const pledger = ledgerMap[firstTr.ledgerId];
      const cledger = ledgerMap[secondTr.ledgerId];
      const tType = firstTr.type === TransactionType.CREDIT ? 'Cr' : 'Dr';
      const { details, ...item2} = item;
      const details2 = details ?? '';
      itemsT.push({
        details: details2?.length < maxLength ? details2 : `${details2?.substring(0, trimLength)}...`,
        ...item2,
        amount: `${firstTr.amount} ${tType}`,
        pledger,
        cledger,


      });

    }

    const expOptions = {
      cell: this.displayedColumns.length,
      rheader: [ ...this.displayedColumns, 'pledger.code', 'cledger.code' ].map((head) => this.columnHeaders[head] ?? head),
      title: table,
      items: itemsT,
      displayedColumns: this.displayedColumns,
      columnHeaders: this.columnHeaders,
      eheader: this.xheaders,
      columnParsingFn: this.columnParsingFn,

    };

    this.mainservice.setExport(expOptions);
    return itemsT;


  }

  private loadData = () => {

    this.loading = true;
    const voucherS$ = this.voucherService.list({...this.queryParams,
      include: [ 'documents' ]});
    const ledgerS$ = this.voucherService.fetchLedgersUsed(this.voucherType);
    forkJoin([ voucherS$, ledgerS$ ]).subscribe(([ voucherListData, ledgers ]) => {

      const ledgerMap: Record<string, Ledger> = {};
      ledgers.forEach((ledger) => (ledgerMap[ledger.id] = ledger));
      const { totalItems, pageIndex, items } = { ...voucherListData };
      const itemsT = this.formatItems(ledgerMap, items);
      this.vouchers = {
        totalItems,
        pageIndex,
        items: itemsT
      };
      this.loading = false;

    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterVoucherComponent, {});
    this.activatedRoute.queryParams.subscribe((value) => {

      const { whereS, ...qParam } = value;
      this.queryParams = qParam;
      if (whereS) {

        this.queryParams.where = JSON.parse(whereS);

      } else {

        this.queryParams.where = {};

      }
      this.queryParams.where.type = this.voucherType;
      this.loadData();

    });

  }

  columnParsingFn = (element: unknown, column: string): string => {

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


}
