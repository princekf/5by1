import { Component, OnInit } from '@angular/core';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { Node, Options } from '@vaseap/ng-material-treetable';
import { environment } from '@fboenvironments/environment';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { forkJoin } from 'rxjs';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { LedgerSummaryTB } from '@shared/util/trial-balance-ledger-summary';

interface TBType {
  ledger: string;
  debit: string;
  credit: string;
}

type LedgerGroupExtra = LedgerGroup & {credit?: number, debit?: 0};
const dcp = environment.decimalPlaces;

@Component({
  selector: 'app-trial-balance-report',
  templateUrl: './trial-balance-report.component.html',
  styleUrls: [ './trial-balance-report.component.scss' ]
})
export class TrialBalanceReportComponent implements OnInit {

  loading = true;

  treeOptions: Options<TBType> = {
    capitalisedHeader: true,
    elevation: 0,
    customColumnOrder: [
      'ledger', 'debit', 'credit'
    ]
  };

  tbData: Node<TBType>[] = [ ];

  constructor(private voucherService: VoucherService,
    private ledgergroupService: LedgergroupService) { }

    private createNodes =
    (lgs: LedgerSummaryTB, nodeMap:Record<string, Node<TBType>>)
    :Array<number> => {

      const {ledger, credit, debit, ledgerGroupId} = lgs;
      const creditS = credit > debit ? (credit - debit).toFixed(dcp) : '';
      const debitS = debit > credit ? (debit - credit).toFixed(dcp) : '';
      if (!creditS && !debitS) {

        return [ 0, 0 ];

      }
      const node:Node<TBType> = {
        value: {ledger,
          credit: creditS,
          debit: debitS},
        children: []
      };
      nodeMap[ledgerGroupId].children.push(node);
      return [ credit, debit ];

    }

    private createEmptyNode = (ldg:{name?: string, id?: string}): Node<TBType> => ({
      value: {
        ledger: ldg.name,
        credit: '',
        debit: '',
      },
      children: [],
    });

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

    private fillCrDr = (node: Node<TBType>):Array<number> => {

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
    (ldg: LedgerGroup, nodeLGMap:Record<string, Node<TBType>>, ldGrpMap:Record<string, LedgerGroupExtra>) => {

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
      const ldGroup$ = this.ledgergroupService.search({});

      forkJoin([ ldgSummary$, ldGroup$ ]).subscribe((results) => {

        const [ lgsArr, ldGroups ] = results;
        const ldGrpMap:Record<string, LedgerGroupExtra> = {};
        const nodeLGMap:Record<string, Node<TBType>> = {};
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

}
