import { Component, OnInit } from '@angular/core';
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
import { FilterItem } from '../../../../directives/table-filter/filter-item';
import { FilterLedgerReportComponent } from '../filter-ledger-report/filter-ledger-report.component';

interface LedgerReportFields {
  id: string;
  number: string;
  type: VoucherType,
  date: Date;
  ledger: string;
  debit: string;
  credit: string;
  details: string;
}

@Component({
  selector: 'app-ledger-report',
  templateUrl: './ledger-report.component.html',
  styleUrls: [ './ledger-report.component.scss' ]
})
export class LedgerReportComponent implements OnInit {

  tableHeader = 'Ledger Report';

  displayedColumns: string[] = [ 'number', 'date', 'type', 'ledger', 'debit', 'credit', 'details' ];

  numberColumns: string[] = [ 'debit', 'credit' ];

  columnHeaders = {
    number: 'Voucher #',
    type: 'Type',
    date: 'Date',
    details: 'Details',
    ledger: 'Ledger',
    debit: 'Debit',
    credit: 'Credit',
  }

  queryParams: QueryData = {};

  loading = true;

  ledgerRows: ListQueryRespType<LedgerReportFields> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
    private voucherService: VoucherService,
    private ledgerService: LedgerService,) { }

    private pushIntoItems =
    (items: Array<LedgerReportFields>, voucher: Voucher, amount: number, tType: TransactionType,
      ledger: string, details: string): void => {

      const { id, number, date, type } = voucher;
      let debit = '';
      let credit = '';
      const amountS = amount.toFixed(environment.decimalPlaces);
      tType === TransactionType.CREDIT ? credit = amountS : debit = amountS;
      items.push({
        id,
        number,
        date,
        type,
        debit,
        credit,
        ledger,
        details: details ?? voucher.details,
      });

    }

  private extractReportItems =
  (vouchers: Array<Voucher>, ledgerId: string):[Array<LedgerReportFields>, Array<string>] => {

    const items: Array<LedgerReportFields> = [];
    const otherLids:Array<string> = [];
    for (const voucher of vouchers) {

      const [ pTran, ...cTrans ] = voucher.transactions;
      if (pTran.ledgerId === ledgerId) {

        for (const cTran of cTrans) {

          this.pushIntoItems(items, voucher, cTran.amount, pTran.type, cTran.ledgerId, cTran.details);
          otherLids.push(cTran.ledgerId);

        }

      } else {

        otherLids.push(pTran.ledgerId);
        cTrans.filter((ctrn) => ctrn.ledgerId === ledgerId).forEach(
          (tran) => this.pushIntoItems(items, voucher, tran.amount, tran.type, pTran.ledgerId, tran.details));

      }

    }
    return [ items, otherLids ];

  }

  private createSummaryRows = (items: Array<LedgerReportFields>, ledger: string, debit: string, credit: string) => {

    items.push({
      id: null,
      number: null,
      ledger,
      type: null,
      date: null,
      credit,
      debit,
      details: ''
    });

  }


  private findBalances = (totalCredit: number, totalDebit: number, sLedger: Ledger):Array<string> => {

    let opBalCr = '';
    let opBalDr = '';
    let balCr = totalCredit;
    let balDr = totalDebit;
    if (sLedger.obType === TransactionType.CREDIT) {

      opBalCr = String(sLedger.obAmount);
      balCr += sLedger.obAmount;

    } else {

      opBalDr = String(sLedger.obAmount);
      balDr += sLedger.obAmount;

    }
    const balCrS = balCr > balDr ? String((balCr - balDr).toFixed(environment.decimalPlaces)) : '';
    const balDrS = balDr > balCr ? String((balDr - balCr).toFixed(environment.decimalPlaces)) : '';
    return [ opBalCr, opBalDr, balCrS, balDrS ];

  }

  private loadData = (ledgerId: string, againstId?: string) => {

    this.voucherService.search(this.queryParams).subscribe((vouchers) => {

      const [ items2, otherLids2 ] = this.extractReportItems(vouchers, ledgerId);
      // To show the details of selected ledger, fetch it from server.
      let otherLids = otherLids2;
      let items = items2;
      if (againstId) {

        items = items2.filter((item) => item.ledger === againstId);
        otherLids = otherLids.filter((oId) => oId === againstId);

      }
      otherLids.push(ledgerId);
      const queryDataL: QueryData = {
        where: {
          id: {
            inq: otherLids
          }
        }
      };
      this.ledgerService.search(queryDataL).subscribe((ledgers) => {

        const ledgerMap:Record<string, Ledger> = {};
        ledgers.forEach((ldg) => (ledgerMap[ldg.id] = ldg));
        const sLedger = ledgerMap[ledgerId];
        this.tableHeader = `Ledger Report -- ${sLedger.name}`;
        let totalDebit = 0;
        let totalCredit = 0;
        items.forEach((item) => {

          item.ledger = ledgerMap[item.ledger].name;
          totalDebit += Number(item.debit);
          totalCredit += Number(item.credit);

        });
        this.createSummaryRows(items, 'Total', String(totalDebit.toFixed(environment.decimalPlaces)), String(totalCredit.toFixed(environment.decimalPlaces)));
        const [ opBalCr, opBalDr, balCrS, balDrS ] = this.findBalances(totalCredit, totalDebit, sLedger);
        this.createSummaryRows(items, 'Opening Balance', opBalDr, opBalCr);
        this.createSummaryRows(items, 'Balance', balDrS, balCrS);
        this.ledgerRows = {
          items,
          totalItems: items.length,
          pageIndex: 0
        };
        this.loading = false;

      });

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterLedgerReportComponent, {});
    this.activatedRoute.queryParams.subscribe((value) => {

      const { whereS, ...qParam } = value;
      this.queryParams = qParam;
      if (whereS) {

        this.loading = true;
        this.queryParams.where = JSON.parse(whereS);
        const ledgerParam = this.queryParams.where['transactions.ledgerId'] as {like: string};
        const againstParam = this.queryParams.where.againstL as {ne: string};
        const ledgerId = ledgerParam?.like;
        const againstId = againstParam?.ne;
        this.loadData(ledgerId, againstId);

      }

    });
    this.loading = false;

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

}
