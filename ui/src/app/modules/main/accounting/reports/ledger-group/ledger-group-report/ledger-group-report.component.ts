import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher, VoucherType } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { FilterItem } from '../../../../directives/table-filter/filter-item';
import { FilterLedgerGroupReportComponent } from '../filter-ledger-group-report/filter-ledger-group-report.component';
import { MatRadioChange } from '@angular/material/radio';
import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
import JSPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LedgerGroupSummary } from '@shared/util/ledger-group-summary';
interface LedgerGroupReportFields {
  id: string;
  number: string;
  type: VoucherType;
  date: Date;
  primaryLedger: string;
  ledger: string;
  debit: string;
  credit: string;
  details: string;
}
interface LedgerGroupSummaryR {
  id: string;
    name: string;
    code: string;
    debit: string;
    credit: string;
    obCredit: string;
    obDebit: string;
    balance: string;
}
interface RowSummary {name: string, credit: number, debit: number}
@Component({
  selector: 'app-ledger-group-report',
  templateUrl: './ledger-group-report.component.html',
  styleUrls: [ './ledger-group-report.component.scss' ]
})
export class LedgerGroupReportComponent implements OnInit {

  tableHeader = 'Ledger Group Report';

  displayedColumns: string[] = [ 'number', 'date', 'type', 'primaryLedger', 'ledger', 'debit', 'credit', 'details' ];

  lengthofcolumn = this.displayedColumns.length;

  sortDisabledColumns: string[] = [ 'date' ];

  numberColumns: string[] = [ 'debit', 'credit', 'obCredit', 'obDebit', 'balance' ];

  reportType = '';

  customColumnOrder1 = [
    'Number', 'Date', 'Type', 'Ledger', 'Debit', 'Credit', 'Details'
  ];

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

  columnHeaders = {
    number: 'Voucher #',
    type: 'Type',
    date: 'Date',
    details: 'Details',
    primaryLedger: 'Primary Ledger',
    ledger: 'Ledger',
    debit: 'Debit',
    credit: 'Credit',
    name: 'Name',
    obDebit: 'OB Debit',
    obCredit: 'OB Credit',
    balance: 'Balance'
  };

  queryParams: QueryData = {};

  loading = true;

  ledgerRows: ListQueryRespType<LedgerGroupReportFields | LedgerGroupSummaryR> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  deleteUri: string = null;

  editUri: string = null;

  constructor(private activatedRoute: ActivatedRoute,
              private voucherService: VoucherService,
              private ledgerService: LedgerService,
              private ledgerGroupService: LedgerGroupService,
              private router:Router) { }

    private pushIntoItems =
    (items: Array<LedgerGroupReportFields>, voucher: Voucher, amount: number, tType: TransactionType,
      primaryLedger: string, ledger: string, details: string): void => {

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
        primaryLedger,
        ledger,
        details: details ?? voucher.details,
      });

    }

  private extractReportItems =
  (vouchers: Array<Voucher>, ledgerIds: Array<string>): [Array<LedgerGroupReportFields>, Array<string>] => {

    const items: Array<LedgerGroupReportFields> = [];
    const otherLids: Array<string> = [];
    for (const voucher of vouchers) {

      const [ pTran, ...cTrans ] = voucher.transactions;
      if (ledgerIds.includes(pTran.ledgerId)) {

        for (const cTran of cTrans) {

          this.pushIntoItems(items, voucher, cTran.amount, pTran.type, pTran.ledgerId, cTran.ledgerId, cTran.details);
          otherLids.push(cTran.ledgerId);

        }

      } else {

        otherLids.push(pTran.ledgerId);
        cTrans.filter((ctrn) => ledgerIds.includes(ctrn.ledgerId)).forEach(
          (tran) => {

            this.pushIntoItems(items, voucher, tran.amount, tran.type, tran.ledgerId, pTran.ledgerId, tran.details);

          });

      }

    }
    return [ items, otherLids ];

  }

  private createSummaryRows = (items: Array<LedgerGroupReportFields>,
    ledger: string, debit: string, credit: string) => {

    items.push({
      id: null,
      number: null,
      ledger,
      primaryLedger: null,
      type: null,
      date: null,
      credit,
      debit,
      details: ''
    });

  }


  private findBalances = (totalCredit: number, totalDebit: number, sLedgers: Array<Ledger>): Array<string> => {

    let totalOBCr = 0;
    let totalOBDr = 0;
    sLedgers.forEach((sLedger) => {

      sLedger.obType === TransactionType.CREDIT ? totalOBCr += sLedger.obAmount : totalOBDr += sLedger.obAmount;

    });
    const opBalCr = String(totalOBCr);
    const opBalDr = String(totalOBDr);
    const balCr = totalCredit + totalOBCr;
    const balDr = totalDebit + totalOBDr;
    const balCrS = balCr > balDr ? String((balCr - balDr).toFixed(environment.decimalPlaces)) : '';
    const balDrS = balDr > balCr ? String((balDr - balCr).toFixed(environment.decimalPlaces)) : '';
    return [ opBalCr, opBalDr, balCrS, balDrS ];

  }

  private createTableRowData =
  (ledgerMap: Record<string, Ledger>, items: Array<LedgerGroupReportFields>, sLedgers: Array<Ledger>) => {

    let totalDebit = 0;
    let totalCredit = 0;
    items.forEach((item) => {

      item.ledger = ledgerMap[item.ledger].name;
      item.primaryLedger = ledgerMap[item.primaryLedger].name;
      totalDebit += Number(item.debit);
      totalCredit += Number(item.credit);

    });
    items = this.createDailyOrMonthlySummary(items);
    this.createSummaryRows(items, 'Total', String(totalDebit.toFixed(environment.decimalPlaces)), String(totalCredit.toFixed(environment.decimalPlaces)));
    const [ opBalCr, opBalDr, balCrS, balDrS ] = this.findBalances(totalCredit, totalDebit, sLedgers);
    this.createSummaryRows(items, 'Opening Balance', opBalDr, opBalCr);
    this.createSummaryRows(items, 'Balance', balDrS, balCrS);
    this.ledgerRows = {
      items,
      totalItems: items.length,
      pageIndex: 0
    };


  }

  private loadData = (ledgerGroupId: string, againstId?: string) => {

    this.ledgerGroupService.get(ledgerGroupId, {}).subscribe((lGroup) => {

      this.tableHeader = `Ledger Group Report -- ${lGroup.name}`;

    });

    const queryP2: QueryData = {
      where: {
        ledgerGroupId: {like: ledgerGroupId,
          options: 'i'}
      }
    };
    this.ledgerService.queryData(queryP2).subscribe((ledgers2) => {

      const ledgerIds: Array<string> = [];
      ledgers2.forEach((lgs) => ledgerIds.push(lgs.id));
      const queryP3 = {...this.queryParams};
      queryP3.where = {...queryP3.where,
        'transactions.ledgerId': {
          in: ledgerIds
        }};
      delete queryP3.where.ledgerGroupId;
      const qParam = {...queryP3};
      qParam.order = [ 'date asc', ...qParam.order ?? [] ];
      this.voucherService.search(qParam).subscribe((vouchers) => {

        const [ items2, otherLids2 ] = this.extractReportItems(vouchers, ledgerIds);
        // To show the details of selected ledger, fetch it from server.
        let otherLids = otherLids2;
        let items = items2;
        if (againstId) {

          items = items2.filter((item) => item.ledger === againstId);
          otherLids = otherLids.filter((oId) => oId === againstId);

        }
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
          ledgers2.forEach((ldg) => (ledgerMap[ldg.id] = ldg));
          this.createTableRowData(ledgerMap, items, ledgers2);
          this.loading = false;

        });

      });

    });


  }

  private createDailyOrMonthlySummary = (items:Array<LedgerGroupReportFields>,
  ) : Array<LedgerGroupReportFields> => {

    if (![ 'daily', 'monthly' ].includes(this.reportType)) {

      return items;

    }

    const format = this.reportType === 'monthly' ? 'MMM - YYYY' : 'DD - MMM - YYYY';
    const monthD: RowSummary = {
      name: '',
      debit: 0,
      credit: 0
    };
    const items2: Array<LedgerGroupReportFields> = [];
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

    this.filterItem = new FilterItem(FilterLedgerGroupReportComponent, {});
    this.activatedRoute.queryParams.subscribe((value) => {

      const { id, whereS, order, rtype, ...qParam } = value;
      if (id) {
        
        this.router.navigate([ '/reports/ledger-group' ], { queryParams: {whereS: `{"ledgerGroupId":{"like":"${id}","options":"i"}}`} });
        return;
  
      }
      this.reportType = rtype;
      this.queryParams = qParam;
      if (typeof order === 'string') {

        this.queryParams.order = [ order ];

      } else {

        this.queryParams.order = order;

      }
      if (whereS) {

        this.loading = true;
        this.displayedColumns = [ 'number', 'date', 'type', 'primaryLedger', 'ledger', 'debit', 'credit', 'details' ];
        this.deleteUri = '/voucher/delete';
        this.editUri = '/voucher/edit';
        this.queryParams.where = JSON.parse(whereS);
        const ledgerGroupParam = this.queryParams.where.ledgerGroupId as {like: string};
        const againstParam = this.queryParams.where.againstL as {ne: string};
        const ledgerGroupId = ledgerGroupParam?.like;
        const againstId = againstParam?.ne;
        this.loadData(ledgerGroupId, againstId);

      } else {

        this.editUri = '/reports/ledger-group';
        this.deleteUri = null;
        this.displayedColumns = [ 'name', 'debit', 'credit', 'obDebit', 'obCredit', 'balance' ];
        this.tableHeader = 'Ledger Group Summary Report';          
        this.voucherService.fetchLedgerGroupSummary().subscribe((result) => {
          const items:Array<LedgerGroupSummaryR> = [];
          const dpL = environment.decimalPlaces;
          result.forEach((res) => {
            const {id, name, code, credit, debit, obCredit, obDebit} = res;
            const balanceI = credit + obCredit - debit - obDebit;
            const balance = `${Math.abs(balanceI).toFixed(dpL)} ${balanceI > 0 ? 'Cr' : 'Dr'}`;
            items.push({
              id,
              name,
              code,
              credit: credit.toFixed(dpL),
              debit: debit.toFixed(dpL),
              obCredit: obCredit.toFixed(dpL),
              obDebit: obDebit.toFixed(dpL),
              balance});
          });
          this.ledgerRows = {
            items,
            totalItems: items.length,
            pageIndex: 0
          };
          this.loading = false;
        });
      }

    });

  }

  handleReportTypeChange = (evt: MatRadioChange):void => {

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

    const array: Array<string> = [ this.tableHeader, '' ];
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
