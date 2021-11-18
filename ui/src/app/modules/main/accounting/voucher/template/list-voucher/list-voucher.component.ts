import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher, VoucherType } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { of, throwError, zip } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FilterItem } from 'src/app/modules/main/directives/table-filter/filter-item';
import { FilterReceiptComponent } from '../../receipt/filter-receipt/filter-receipt.component';

@Component({
  selector: 'app-list-voucher',
  templateUrl: './list-voucher.component.html',
  styleUrls: [ './list-voucher.component.scss' ]
})
export class ListVoucherComponent implements OnInit {

  @Input() voucherType: VoucherType;

  @Input() editUri: string;

  @Input() tableHeader: string;

  displayedColumns: string[] = [ 'number', 'date', 'pledger', 'cledger', 'amount', 'details' ];

  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    details: 'Details',
    pledger: 'Primary Ledger',
    cledger: 'Compound Ledger',
    amount: 'Amount'
  }

  queryParams: QueryData = {};

  loading = true;

  vouchers: ListQueryRespType<Voucher & { amount: string, pledger: string, cledger: string }> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(private activatedRoute: ActivatedRoute,
    private voucherService: VoucherService,
    private ledgerService: LedgerService,) { }

  private loadData = () => {

    this.loading = true;
    this.voucherService.list(this.queryParams)
      .pipe(catchError((err) => throwError(err)))
      .pipe(switchMap((voucherListData) => {

        const ledgerIds: Array<string> = [];
        for (const pItem of voucherListData.items) {

          ledgerIds.push(pItem.transactions[0].ledgerId);
          ledgerIds.push(pItem.transactions[1].ledgerId);

        }
        const queryDataL: QueryData = {
          where: {
            id: {
              inq: ledgerIds
            }
          }
        };
        const findLedgersL$ = this.ledgerService.search(queryDataL);
        return zip(of(voucherListData), findLedgersL$);

      }))
      .subscribe(([ voucherListData, ledgers ]) => {

        const ledgerMap: Record<string, Ledger> = {};
        ledgers.forEach((ledger) => (ledgerMap[ledger.id] = ledger));
        const { totalItems, pageIndex, items } = { ...voucherListData };
        const itemsT = [];
        for (const item of items) {

          const [ firstTr, secondTr ] = item.transactions;
          const pledger = ledgerMap[firstTr.ledgerId];
          const cledger = ledgerMap[secondTr.ledgerId];
          const tType = firstTr.type === TransactionType.CREDIT ? 'Cr' : 'Dr';
          itemsT.push({
            ...item,
            amount: `${firstTr.amount} ${tType}`,
            pledger: pledger.name,
            cledger: cledger.name,
          });

        }
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

  };

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterReceiptComponent, {});

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


}
