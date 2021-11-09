import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { MainService } from '@fboservices/main.service';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError, zip } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-delete-voucher',
  templateUrl: './delete-voucher.component.html',
  styleUrls: [ './delete-voucher.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteVoucherComponent implements OnInit {

  displayedColumns: string[] = [ 'number', 'date', 'ledger', 'amount', 'details' ];

  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    details: 'Details',
    ledger: 'Ledger',
    amount: 'Amount'
  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;


  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Voucher & { amount: string, ledger: string }>([]);

  findColumnValue = _findColumnValue;

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly voucherService: VoucherService,
    private ledgerService: LedgerService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService) { }

  private createVoucherDataObservable = ():Observable<[Voucher[], Ledger[]]> => {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      where: {
        id: {
          inq: tIdArray
        }
      }
    };

    return this.voucherService.search(queryData)
      .pipe(catchError((err) => throwError(err)))
      .pipe(switchMap((vouchers) => {

        const ledgerIds: Array<string> = [];
        for (const pItem of vouchers) {

          ledgerIds.push(pItem.transactions[0].ledgerId);

        }
        const queryDataL: QueryData = {
          where: {
            id: {
              inq: ledgerIds
            }
          }
        };
        const findLedgersL$ = this.ledgerService.search(queryDataL);
        return zip(of(vouchers), findLedgersL$);

      }));

  }

  ngOnInit(): void {

    this.createVoucherDataObservable().subscribe(([ vouchers, ledgers ]) => {

      const ledgerMap: Record<string, Ledger> = {};
      ledgers.forEach((ledger) => (ledgerMap[ledger.id] = ledger));
      const itemsT = [];
      for (const item of vouchers) {

        const [ firstTr ] = item.transactions;
        const ledger = ledgerMap[firstTr.ledgerId];
        const tType = firstTr.type === TransactionType.CREDIT ? 'Cr' : 'Dr';
        itemsT.push({
          ...item,
          amount: `${firstTr.amount} ${tType}`,
          ledger: ledger.name,
        });

        this.dataSource.data = itemsT;
        this.loading = false;

      }

    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

  ngAfterViewInit(): void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'date':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  deleteVouchers(): void {

    this.loading = true;
    const vouchers = this.dataSource.data;
    const tIds = [];
    vouchers.forEach((vchP) => tIds.push(vchP.id));
    const where = {id: {
      inq: tIds
    }};

    this.voucherService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Vouchers are deleted successfully`, 'Vouchers deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Vouchers', 'Vouchers not deleted');
      console.error(error);

    });

  }

}
