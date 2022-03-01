import { Component, OnInit } from '@angular/core';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { Node, Options } from '@vaseap/ng-material-treetable';
import { environment } from '@fboenvironments/environment';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { forkJoin } from 'rxjs';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { LedgerSummaryTB } from '@shared/util/trial-balance-ledger-summary';
import JSPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as Excel from 'exceljs';
import * as saveAs from 'file-saver';
interface TBType {
  ledger: string;
  debit: string;
  credit: string;
}

type LedgerGroupExtra = LedgerGroup & {credit?: number, debit?: 0};
const dcp = environment.decimalPlaces;
const str = '';
const len = str.length;
const space = 4;
const space1 = 8;
const space2 = 12;
@Component({
  selector: 'app-trial-balance-report',
  templateUrl: './trial-balance-report.component.html',
  styleUrls: [ './trial-balance-report.component.scss' ]
})
export class TrialBalanceReportComponent implements OnInit {


  loading = true;

  columnHeaders = {

    ledger: 'Ledger',
    debit: 'Debit',
    credit: 'Credit'
  };

  customColumnOrder1 = [
    'Ledger', 'Debit', 'Credit'
  ];

  lengthofcolumn = this.customColumnOrder1.length;

  xheaders = [

    {key: 'ledger',
      width: 30, },
    {key: 'debit',
      width: 30 },
    { key: 'credit',
      width: 30 }
  ];

  treeOptions: Options<TBType> = {
    capitalisedHeader: true,
    elevation: 0,
    customColumnOrder: [
      'ledger', 'debit', 'credit'
    ]
  };

  tbData: Node<TBType>[] = [ ];

  constructor(private voucherService: VoucherService,
              private ledgerGroupService: LedgerGroupService) { }

    private createNodes =
    (lgs: LedgerSummaryTB, nodeMap: Record<string, Node<TBType>>)
    : Array<number> => {

      const {ledger, credit, debit, ledgerGroupId} = lgs;
      const creditS = credit > debit ? (credit - debit).toFixed(dcp) : '';
      const debitS = debit > credit ? (debit - credit).toFixed(dcp) : '';
      if (!creditS && !debitS) {

        return [ 0, 0 ];

      }
      const node: Node<TBType> = {
        value: {ledger,
          credit: creditS,
          debit: debitS},
        children: []
      };


      nodeMap[ledgerGroupId].children.push(node);
      return [ credit, debit ];


    }


    private createEmptyNode = (ldg: {name?: string, id?: string}): Node<TBType> => ({
      value: {
        ledger: ldg.name,
        credit: '',
        debit: '',
      },
      children: [],
    })

    private removeRowWithoutData = (node: Node<TBType>) => {

      if (!node.children.length) {

        return;

      }
      const [ ...childs ] = node.children;
      node.children = [];
      for (const child of childs) {

        if (child.value.credit || child.value.debit) {

          node.children.push(child);

        }

      }
      node.children.forEach((child) => this.removeRowWithoutData(child));

    }

    private fillCrDr = (node: Node<TBType>): Array<number> => {

      if (node.children.length) {

        let credit = 0;
        let debit = 0;
        for (const cNode of node.children) {

          const [ crD, drD ] = this.fillCrDr(cNode);
          credit += crD;
          debit += drD;

        }

        node.value.credit = credit > debit ? (credit - debit).toFixed(dcp) : '';
        node.value.debit = debit > credit ? (debit - credit).toFixed(dcp) : '';


      }
      return [ node.value.credit ? Number(node.value.credit) : 0, node.value.debit ? Number(node.value.debit) : 0 ];

    }

    private createLGMap =
    (ldg: LedgerGroup, nodeLGMap: Record<string, Node<TBType>>, ldGrpMap: Record<string, LedgerGroupExtra>) => {


      ldGrpMap[ldg.id] = {...ldg,
        credit: 0,
        debit: 0};
      if (ldg.parentId && !nodeLGMap[ldg.parentId]) {

        nodeLGMap[ldg.parentId] = this.createEmptyNode({id: ldg.parentId,
          name: ''});

      }
      if (!nodeLGMap[ldg.id]) {

        nodeLGMap[ldg.id] = this.createEmptyNode(ldg);

      } else {

        nodeLGMap[ldg.id].value.ledger = ldg.name;

      }
      nodeLGMap[ldg.parentId]?.children.push(nodeLGMap[ldg.id]);

    }


    ngOnInit(): void {


      const ldgSummary$ = this.voucherService.fetchLedgerSummary();
      const ldGroup$ = this.ledgerGroupService.search({});

      forkJoin([ ldgSummary$, ldGroup$ ]).subscribe((results) => {

        const [ lgsArr, ldGroups ] = results;
        const ldGrpMap: Record<string, LedgerGroupExtra> = {};
        const nodeLGMap: Record<string, Node<TBType>> = {};
        ldGroups.forEach((ldg) => this.createLGMap(ldg, nodeLGMap, ldGrpMap));
        let totalDebit = 0;
        let totalCredit = 0;
        const tbData2: Node<TBType>[] = [];
        lgsArr.forEach((lgs) => {

          const [ credit, debit ] = this.createNodes(lgs, nodeLGMap);
          totalDebit += debit;
          totalCredit += credit;

        });

        Object.keys(nodeLGMap).forEach((ldgGrpId) => {

          if (!ldGrpMap[ldgGrpId].parentId) {

            tbData2.push(nodeLGMap[ldgGrpId]);

          }

        });
        for (const tbD of tbData2) {

          this.fillCrDr(tbD);
          // Remove rows with empty credit/debit.
          this.removeRowWithoutData(tbD);

        }
        this.tbData = tbData2;
        tbData2.push({
          value: {
            ledger: 'Total',
            credit: totalCredit.toFixed(dcp),
            debit: totalDebit.toFixed(dcp),
          },
          children: []
        });

        this.loading = false;

      });

    }

    exportExcel(): void {

      const array: Array<string> = [
        'XPEDITIONS',
        'Trial Balance'

      ];
      const EXCEL_EXTENSION = '.xlsx';
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


      const rowData = this.tbData;


      const maintree = [];


      rowData.forEach((element) => {

        maintree.push([ element.value.ledger, element.value.debit, element.value.credit ]);

        element.children.forEach((element1) => {

          maintree.push([ str.padStart(len + space, ' ') + element1.value.ledger, element1.value.debit, element1.value.credit ]);
          element1.children.forEach((element2) => {

            maintree.push([ str.padStart(len + space1, ' ') + element2.value.ledger, element2.value.debit, element2.value.credit ]);
            element2.children.forEach((element3) => {

              maintree.push([ str.padStart(len + space2, ' ') + element3.value.ledger, element3.value.debit, element3.value.credit ]);


            });

          });


        });

      });


      const rowdata = maintree;


      worksheet.addRow(this.customColumnOrder1, 'n');
      worksheet.columns = this.xheaders;
      const headerrownumber = 4;
      worksheet.getRow(headerrownumber).font = {bold: true };
      worksheet.getRow(headerrownumber).alignment = {horizontal: 'center' };

      rowdata.forEach((element) => {

        worksheet.addRow(element, 'n');

      });


      workbook.xlsx.writeBuffer().then((data) => {

        const blob = new Blob([ data ]);

        saveAs(blob, `Trial-Balance${EXCEL_EXTENSION}`);

      });

    }

    convert(): void {

      const rowData = this.tbData;

      const maintree = [];


      rowData.forEach((element) => {

        maintree.push([ element.value.ledger, element.value.debit, element.value.credit ]);


        element.children.forEach((element1) => {

          maintree.push([ str.padStart(len + space, ' ') + element1.value.ledger, element1.value.debit, element1.value.credit ]);

          element1.children.forEach((element2) => {

            maintree.push([ str.padStart(len + space1, ' ') + element2.value.ledger, element2.value.debit, element2.value.credit ]);
            element2.children.forEach((element3) => {

              maintree.push([ str.padStart(len + space2, ' ') + element3.value.ledger, element3.value.debit, element3.value.credit ]);


            });

          });


        });

      });
      const rowdata = maintree;

      const array: Array<string> = [
        'XPEDITIONS',
        'Trial Balance',
        'Date:'

      ];
      const doc = new JSPDF();
      const col = this.columnHeaders;

      const FontSize = 16;
      doc.setFontSize(FontSize);
      const headerhorizontal = 80;
      const headervertical = 10;
      doc.text(array.join('\n'), headerhorizontal, headervertical);


      autoTable(

        doc, {head: [ col ],
          body: rowdata,
          startY: 25, });

      doc.save('Trial-Balance');

    }

}

