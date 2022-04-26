
import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
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
import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
import JSPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
interface LedgerReportFields {
  id: string;
  number: string;
  type: VoucherType;
  date: Date;
  ledger: string;
  debit: string;
  credit: string;
  details: string;
}

interface RowSummary {name: string; credit: number; debit: number; }
@Component({
  selector: 'app-ledger-report',
  templateUrl: './ledger-report.component.html',
  styleUrls: [ './ledger-report.component.scss' ]
})
export class LedgerReportComponent implements OnInit {

  tableHeader = 'Ledger Report';


  displayedColumns: string[] = [ 'number', 'date', 'type', 'ledger', 'debit', 'credit', 'details' ];

  lengthofcolumn = this.displayedColumns.length;

  sortDisabledColumns: string[] = [ 'date' ];

  numberColumns: string[] = [ 'debit', 'credit' ];

  reportType = '';

  customColumnOrder1 = [
    'Number', 'Date', 'Type', 'Ledger', 'Debit', 'Credit', 'Details'
  ];

  columnHeaders = {
    number: 'Voucher #',
    type: 'Type',
    date: 'Date',
    details: 'Details',
    ledger: 'Ledger',
    debit: 'Debit',
    credit: 'Credit',
  };

  xheaders = [

    {key: 'number',
      width: 30, },
    {key: 'type',
      width: 30 },
    { key: 'date',
      width: 30 },
    { key: 'details',
      width: 30 },
    { key: 'ledger',
      width: 30 },
    { key: 'debit',
      width: 30 },
    { key: 'credit',
      width: 30 }

  ];

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
              private ledgerService: LedgerService,
              private router: Router) { }

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
  (vouchers: Array<Voucher>, ledgerId: string): [Array<LedgerReportFields>, Array<string>] => {

    const items: Array<LedgerReportFields> = [];
    const otherLids: Array<string> = [];
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


  private findBalances = (totalCredit: number, totalDebit: number, sLedger: Ledger): Array<string> => {

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

    const qParam = {...this.queryParams};
    qParam.order = [ 'date asc', ...qParam.order ?? [] ];
    this.voucherService.search(qParam).subscribe((vouchers) => {

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

        const ledgerMap: Record<string, Ledger> = {};
        ledgers.forEach((ldg) => (ledgerMap[ldg.id] = ldg));
        const sLedger = ledgerMap[ledgerId];
        this.tableHeader = `Ledger Report -- ${sLedger?.name}`;
        let totalDebit = 0;
        let totalCredit = 0;
        items.forEach((item, idx: number) => {

          item.ledger = ledgerMap[item.ledger].name;
          totalDebit += Number(item.debit);
          totalCredit += Number(item.credit);

        });
        items = this.createDailyOrMonthlySummary(items);
        const str = String(totalDebit.toFixed(environment.decimalPlaces));
        this.createSummaryRows(items, 'Total', str, String(totalCredit.toFixed(environment.decimalPlaces)));
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

  private createDailyOrMonthlySummary = (items: Array<LedgerReportFields>,
  ): Array<LedgerReportFields> => {

    if (![ 'daily', 'monthly' ].includes(this.reportType)) {

      return items;

    }

    const format = this.reportType === 'monthly' ? 'MMM - YYYY' : 'DD - MMM - YYYY';
    const monthD: RowSummary = {
      name: '',
      debit: 0,
      credit: 0
    };
    const items2: Array<LedgerReportFields> = [];
    const dpL = environment.decimalPlaces;

    items.forEach((item, idx: number) => {

      const cMonth = dayjs(item.date).format(format);
      monthD.name = cMonth;
      monthD.credit += Number(item.credit);
      monthD.debit += Number(item.debit);
      items2.push(item);


      if (idx) {

        const nMonth = dayjs(items[idx + 1]?.date)?.format(format);
        if (monthD.name !== nMonth) {

          this.createSummaryRows(items2, monthD.name, monthD.debit.toFixed(dpL), monthD.credit.toFixed(dpL));
          monthD.credit = 0;
          monthD.debit = 0;

        }

      }


    });
    return items2;

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterLedgerReportComponent, {});
    this.activatedRoute.queryParams.subscribe((value) => {

      const { whereS, order, rtype, ...qParam } = value;
      this.reportType = rtype;
      this.queryParams = qParam;
      if (typeof order === 'string') {

        this.queryParams.order = [ order ];

      } else {

        this.queryParams.order = order;

      }
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

  handleReportTypeChange = (evt: MatRadioChange): void => {

    const {where, ...others} = this.queryParams;
    const whereS = JSON.stringify(where);
    this.router.navigate([], { queryParams: {whereS,
      rtype: evt.value,
      ...others} });

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

    const array: Array<string> = [
      this.tableHeader,
      ''

    ];
    const items = [];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet();
    worksheet.getCell('A1', 'n').value = array.join('\n');

    worksheet.getCell('A1').alignment = {vertical: 'middle',
      horizontal: 'center' };
    worksheet.getCell('A1').font = {
      size: 12,
      bold: true
    };
    const rownumber = 3;
    worksheet.mergeCells(1, 1, rownumber, this.lengthofcolumn);


    const rowData = this.ledgerRows;
    items.push(rowData.items);
    const rData1 = [];


    items[0].forEach((element) => {


      const rData = [ element.number, element.date, element.type, element.ledger, element.debit,
        element.credit, element.details ];
      rData1.push(rData);

    });

    worksheet.addRow(this.customColumnOrder1, 'n');
    worksheet.columns = this.xheaders;
    const headerrownumber = 4;
    worksheet.getRow(headerrownumber).font = {bold: true };
    worksheet.getRow(headerrownumber).alignment = {horizontal: 'center' };
    rData1.forEach((element) => {

      worksheet.addRow(element, 'n');

    });


    workbook.xlsx.writeBuffer().then((data) => {

      const blob = new Blob([ data ]);

      saveAs(blob, `${this.tableHeader}.xlsx`);

    });

  }

  convert(): void {

    const items = [];

    const rowData = this.ledgerRows;
    items.push(rowData.items);
    const rData1 = [];


    items[0].forEach((element) => {


      const rData = [ element.number, element.date, element.type, element.ledger, element.debit,
        element.credit, element.details ];
      rData1.push(rData);

    });
    const filename = this.tableHeader;
    const header = this.tableHeader;
    const doc = new JSPDF();
    const col = this.columnHeaders;
    const FontSize = 14;
    doc.setFontSize(FontSize);
    const headerhorizontal = 70;
    const headervertical = 10;
    doc.text(header, headerhorizontal, headervertical);


    autoTable(

      doc, {
        head: [ col ],
        body: rData1,


      });

    doc.save(filename);

  }

}
