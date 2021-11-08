import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import { of, throwError, zip } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FilterItem } from '../../../../directives/table-filter/filter-item';
import { FilterJournalComponent } from '../filter-journal/filter-journal.component';
@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: [ './list-journal.component.scss' ]
})
export class ListJournalComponent implements OnInit {

  displayedColumns: string[] = [ 'number', 'date', 'ledger', 'amount', 'type', 'details' ];

  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    type: 'Type',
    details: 'Details',
    ledger: 'Ledger',
    amount: 'Amount'
  }

  queryParams: QueryData = {};

  loading = true;

  vouchers: ListQueryRespType<Voucher & {amount: string, ledger: string}> = {
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

          const ledgerIds:Array<string> = [];
          for (const pItem of voucherListData.items) {

            ledgerIds.push(pItem.transactions[0].ledgerId);

          }
          const queryDataL:QueryData = {
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

          const ledgerMap:Record<string, Ledger> = {};
          ledgers.forEach((ledger) => (ledgerMap[ledger.id] = ledger));
          const {totalItems, pageIndex, items } = {...voucherListData};
          const itemsT = [];
          for (const item of items) {

            const [ firstTr ] = item.transactions;
            const ledger = ledgerMap[firstTr.ledgerId];
            const tType = firstTr.type === TransactionType.CREDIT ? 'Cr' : 'Dr';
            itemsT.push({
              ...item,
              amount: `${firstTr.amount} ${tType}`,
              ledger: ledger.name,
            });

          }
          this.vouchers = {totalItems,
            pageIndex,
            items: itemsT};
          this.loading = false;

        }, (error) => {

          console.error(error);
          this.loading = false;

        });

    };

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterJournalComponent, {});

      this.activatedRoute.queryParams.subscribe((value) => {

        const {whereS, ...qParam} = value;
        this.queryParams = qParam;
        if (whereS) {

          this.queryParams.where = JSON.parse(whereS);

        }

        this.loadData();

      });

    }

}
