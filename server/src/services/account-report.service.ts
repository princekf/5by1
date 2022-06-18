import {injectable, BindingScope, service} from '@loopback/core';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { LedgerGroupService } from './ledger-group.service';
import { VoucherService } from './voucher.service';
import { LedgerGroup as LedgerGroupIntf } from '@shared/entity/accounting/ledger-group';
import { DECIMAL_PART } from '../utils/fbo-server-util';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { LedgerService } from './ledger.service';

// Get decimal place count from user session.
const decimal = 2;

@injectable({scope: BindingScope.TRANSIENT})
export class AccountReportService {

  constructor(
    @service(VoucherService) public voucherService: VoucherService,
    @service(LedgerGroupService) public ledgerGroupService: LedgerGroupService,
    @service(LedgerService) public ledgerService: LedgerService,
  ) {}


  private createSingleItem = (lItem: string, lAmount: string, rItem: string, rAmount: string):BalanceSheetItem => ({
    lItem,
    lAmount,
    rItem,
    rAmount
  })

  private generateReport =(leftLGs: Array<LedgerGroupIntf>, rightLGs: Array<LedgerGroupIntf>,
    ldGMap:Record<string, {debit: number, credit: number}>)
    : {bItems: Array<BalanceSheetItem>; totalLeft: number; totalRight: number} => {


    const bItems: Array<BalanceSheetItem> = [];
    let totalLeft = 0;
    let totalRight = 0;
    for (let idx = 0; idx < leftLGs.length || idx < rightLGs.length; idx++) {

      const item: BalanceSheetItem = {
        lItem: '',
        lAmount: '',
        rItem: '',
        rAmount: ''
      };
      bItems.push(item);
      if (idx < leftLGs.length) {

        const ldG = leftLGs[idx];
        const amount = (ldGMap[ldG.id ?? ''].debit ?? 0) - (ldGMap[ldG.id ?? ''].credit ?? 0);
        totalLeft += amount;
        item.lItem = ldG.name ?? '';
        item.lAmount = amount.toFixed(decimal);

      }
      if (idx < rightLGs.length) {

        const ldG = rightLGs[idx];
        const amount = (ldGMap[ldG.id ?? ''].credit ?? 0) - (ldGMap[ldG.id ?? ''].debit ?? 0);
        totalRight += amount;
        item.rItem = ldG.name ?? '';
        item.rAmount = amount.toFixed(decimal);

      }

    }
    return {bItems,
      totalLeft,
      totalRight};

  }

  private findLedgerGroupSummaryMap =
  (filtTBs: Array<TrialBalanceItem>): Record<string, {debit: number, credit: number}> => {

    const ldGMap:Record<string, {debit: number, credit: number}> = {};
    for (const summTB of filtTBs) {

      const ldgId = summTB.parentId;
      ldGMap[ldgId] = ldGMap[ldgId] ?? {debit: 0,
        credit: 0};
      ldGMap[ldgId].credit += summTB.credit ?? 0;
      ldGMap[ldgId].debit += summTB.debit ?? 0;
      ldGMap[ldgId].credit += summTB.obCredit;
      ldGMap[ldgId].debit += summTB.obDebit;

    }
    return ldGMap;

  }

  private generateTradingReport =
  (lgsWithParents:Array<LedgerGroupIntf>,
    ldGMap:Record<string, {debit: number, credit: number}>):
    {bItems: Array<BalanceSheetItem>, isProfit: boolean, profLoss: number} => {

    const bItems: Array<BalanceSheetItem> = [];
    const dirIncomeLdGs = lgsWithParents.filter((ldG) => ldG.code === 'DIRINCM' || ldG.parents?.find((lgP) => lgP.code === 'DIRINCM'));
    const dirExpenseLdGs = lgsWithParents.filter((ldG) => ldG.code === 'DIREXPNS' || ldG.parents?.find((lgP) => lgP.code === 'DIREXPNS'));
    bItems.push(this.createSingleItem('Trading Report', '', '', ''));
    const tItems = this.generateReport(dirExpenseLdGs, dirIncomeLdGs, ldGMap);
    bItems.push(...tItems.bItems);
    const profLoss = Math.abs(tItems.totalRight - tItems.totalLeft);
    const isProfit = tItems.totalRight > tItems.totalLeft;
    bItems.push(this.createSingleItem(isProfit ? 'Gross profit' : '', isProfit ? profLoss.toFixed(decimal) : '', !isProfit ? 'Gross loss' : '', !isProfit ? profLoss.toFixed(decimal) : ''));
    return {bItems,
      isProfit,
      profLoss};

  }

  private generateBalanceReport =
  (lgsWithParents:Array<LedgerGroupIntf>,
    ldGMap:Record<string, {debit: number, credit: number}>):
    {bItems: Array<BalanceSheetItem>, isProfit: boolean, profLoss: number} => {

    const bItems: Array<BalanceSheetItem> = [];
    const asssetsLdGs = lgsWithParents.filter((ldG) => ldG.code === 'ASTS' || ldG.parents?.find((lgP) => lgP.code === 'ASTS'));
    const liablitiesLdGs = lgsWithParents.filter((ldG) => ldG.code === 'LBLTS' || ldG.parents?.find((lgP) => lgP.code === 'LBLTS'));
    const tItems = this.generateReport(asssetsLdGs, liablitiesLdGs, ldGMap);
    bItems.push(...tItems.bItems);
    const profLoss = Math.abs(tItems.totalRight - tItems.totalLeft);
    const isProfit = tItems.totalRight > tItems.totalLeft;
    bItems.push(this.createSingleItem('Total', tItems.totalLeft.toFixed(decimal), 'Total', tItems.totalRight.toFixed(decimal)));
    return {bItems,
      isProfit,
      profLoss};

  }

  private generatePLReport =
  (lgsWithParents:Array<LedgerGroupIntf>,
    ldGMap:Record<string, {debit: number, credit: number}>, isGProfit: boolean, profLossG: number):
    {bItems: Array<BalanceSheetItem>, isProfit: boolean, profLoss: number} => {

    const bItems: Array<BalanceSheetItem> = [];
    bItems.push(this.createSingleItem(!isGProfit ? 'Gross loss' : '', !isGProfit ? profLossG.toFixed(decimal) : '', isGProfit ? 'Gross profit' : '', isGProfit ? profLossG.toFixed(decimal) : ''));
    const inDirIncomeLdGs = lgsWithParents.filter((ldG) => ldG.code === 'IDRINC' || ldG.parents?.find((lgP) => lgP.code === 'IDRINC'));
    const inDirExpenseLdGs = lgsWithParents.filter((ldG) => ldG.code === 'IDIREXPNS' || ldG.parents?.find((lgP) => lgP.code === 'IDIREXPNS'));
    const plItems = this.generateReport(inDirExpenseLdGs, inDirIncomeLdGs, ldGMap);
    bItems.push(...plItems.bItems);
    const netProfit = plItems.totalRight - plItems.totalLeft + (isGProfit ? 1 : -1) * profLossG;
    const isProfit = netProfit > 0;
    const profLoss = Math.abs(netProfit);
    bItems.push(this.createSingleItem(isProfit ? 'Net profit' : '', isProfit ? profLoss.toFixed(decimal) : '', !isProfit ? 'Net loss' : '', !isProfit ? profLoss.toFixed(decimal) : ''));
    return {bItems,
      isProfit,
      profLoss};

  }

  private generateProfitLossReport = async(ason: Date):
  Promise<{ bItems: Array<BalanceSheetItem>; isProfit: boolean; profLoss: number; }> => {

    const summTBs = await this.voucherService.generateLedgerSummary(ason);
    // Filter the ledgers with balance
    const filtTBs = summTBs.filter((sTB) => (sTB.credit ?? 0) - (sTB.debit ?? 0) + sTB.obCredit - sTB.obDebit);
    // Find ledger group wise summary
    const ldGMap = this.findLedgerGroupSummaryMap(filtTBs);
    const lgsWithParents = await this.ledgerGroupService.findLedgerGroupsWithParents(Object.keys(ldGMap));
    const bItemsP: Array<BalanceSheetItem> = [];
    // Trading Account Report
    const trdItems = this.generateTradingReport(lgsWithParents, ldGMap);
    bItemsP.push(...trdItems.bItems);
    // P&L Report
    const {bItems, isProfit, profLoss} =
    this.generatePLReport(lgsWithParents, ldGMap, trdItems.isProfit, trdItems.profLoss);
    bItemsP.push(this.createSingleItem('P&L Report', '', '', ''));
    bItemsP.push(...bItems);
    return {bItems: bItemsP,
      isProfit,
      profLoss};

  }


  private generateBalanceSheetReport = async(ason: Date):
  Promise<{ bItems: Array<BalanceSheetItem>; isProfit: boolean; profLoss: number; }> => {

    const summTBs = await this.voucherService.generateLedgerSummary(ason);
    // Filter the ledgers with balance
    const filtTBs = summTBs.filter((sTB) => (sTB.credit ?? 0) - (sTB.debit ?? 0) + sTB.obCredit - sTB.obDebit);
    // Find ledger group wise summary
    const ldGMap = this.findLedgerGroupSummaryMap(filtTBs);
    const lgsWithParents = await this.ledgerGroupService.findLedgerGroupsWithParents(Object.keys(ldGMap));
    const bItemsP: Array<BalanceSheetItem> = [];
    // Balance sheet Report
    const {bItems, isProfit, profLoss} = this.generateBalanceReport(lgsWithParents, ldGMap);
    bItemsP.push(...bItems);
    return {bItems: bItemsP,
      isProfit,
      profLoss};

  }

  private fillLGMap = (lGMap:Record<string, TrialBalanceItem>, lGs: Array<TrialBalanceItem>) => {

    for (const lGI of lGs) {

      lGMap[lGI.id] = lGI;
      this.fillLGMap(lGMap, lGI.children ?? []);

    }

  }

  private fillTreeWithLedger = (lSumm: Array<TrialBalanceItem>, lGMap:Record<string, TrialBalanceItem>) => {

    for (const ldS of lSumm) {

      ldS.credit = Number((ldS.credit ?? 0).toFixed(DECIMAL_PART));
      ldS.debit = Number((ldS.debit ?? 0).toFixed(DECIMAL_PART));
      ldS.obCredit = Number((ldS.obCredit ?? 0).toFixed(DECIMAL_PART));
      ldS.obDebit = Number((ldS.obDebit ?? 0).toFixed(DECIMAL_PART));
      const opening = ldS.obCredit - ldS.obDebit;
      ldS.opening = opening ? `${Math.abs(opening).toFixed(DECIMAL_PART)} ${opening > 0 ? 'Cr' : 'Dr'}` : '';
      const balance = ldS.credit + ldS.obCredit - ldS.debit - ldS.obDebit;
      ldS.balance = balance ? `${Math.abs(balance).toFixed(DECIMAL_PART)} ${balance > 0 ? 'Cr' : 'Dr'}` : '';
      lGMap[ldS.parentId].children = lGMap[ldS.parentId].children ?? [];
      lGMap[ldS.parentId].children.push(ldS);

    }

  }

    private fillTreeWithLedgerGroups = (lSumm: Array<TrialBalanceItem>, lGMap:Record<string, TrialBalanceItem>) => {


      for (const ldS of lSumm) {

        let parent = lGMap[ldS.parentId];
        while (parent) {

          parent.credit = Number(((ldS.credit ?? 0) + (parent.credit || 0)).toFixed(DECIMAL_PART));
          parent.debit = Number(((ldS.debit ?? 0) + (parent.debit || 0)).toFixed(DECIMAL_PART));
          parent.obCredit = Number((ldS.obCredit + (parent.obCredit || 0)).toFixed(DECIMAL_PART));
          parent.obDebit = Number((ldS.obDebit + (parent.obDebit || 0)).toFixed(DECIMAL_PART));
          const opening = parent.obCredit - parent.obDebit;
          parent.opening = opening ? `${Math.abs(opening).toFixed(DECIMAL_PART)} ${opening > 0 ? 'Cr' : 'Dr'}` : '';
          const balance = parent.credit + parent.obCredit - parent.debit - parent.obDebit;
          parent.balance = balance ? `${Math.abs(balance).toFixed(DECIMAL_PART)} ${balance > 0 ? 'Cr' : 'Dr'}` : '';
          parent = lGMap[parent.parentId];

        }

      }

    }

  private findSummary = (items: Array<TrialBalanceItem>): TrialBalanceItem => {

    let credit = 0;
    let debit = 0;
    let obCredit = 0;
    let obDebit = 0;
    for (const item of items) {

      credit += item.credit ?? 0;
      debit += item.debit ?? 0;
      obCredit += item.obCredit ?? 0;
      obDebit += item.obDebit ?? 0;

    }
    const balanceN = credit - debit + obCredit - obDebit;
    const balance = `${Math.abs(balanceN).toFixed(DECIMAL_PART)} ${balanceN > 0 ? 'Cr' : 'Dr'}`;
    const openingN = obCredit - obDebit;
    const opening = `${Math.abs(openingN).toFixed(DECIMAL_PART)} ${openingN > 0 ? 'Cr' : 'Dr'}`;
    return {
      id: '',
      parentId: '',
      name: 'Total',
      code: '',
      credit: Number(credit.toFixed(DECIMAL_PART)),
      debit: Number(debit.toFixed(DECIMAL_PART)),
      obCredit: Number(obCredit.toFixed(DECIMAL_PART)),
      obDebit: Number(obDebit.toFixed(DECIMAL_PART)),
      opening,
      balance,
      children: []
    };

  }

  private removeEmptyItems = (items: Array<TrialBalanceItem>):Array<TrialBalanceItem> => {

    const itemsF = items?.filter((item) => item.credit || item.debit || item.obCredit || item.obDebit);
    itemsF?.forEach((item) => {

      item.children = this.removeEmptyItems(item.children);

    });
    return itemsF;

  }

  ledgerGroupSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const plItems = await this.voucherService.generateLedgerGroupSummary(ason);
    plItems.forEach((item) => {

      const openingI = item.obCredit ?? item.obDebit;
      item.opening = openingI ? `${openingI.toFixed(DECIMAL_PART)} ${item.obCredit ? 'Cr' : 'Dr'}` : '';

      const balanceI = (item.credit ?? 0) + (item.obCredit ?? 0) - (item.debit ?? 0) - (item.obDebit ?? 0);
      item.balance = balanceI ? `${Math.abs(balanceI).toFixed(DECIMAL_PART)} ${balanceI > 0 ? 'Cr' : 'Dr'}` : '';

    });
    return plItems;

  }

  generateLedgerSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const plItems = await this.voucherService.generateLedgerSummary(ason);
    plItems.forEach((item) => {

      item.credit = item.credit ? Number(item.credit.toFixed(DECIMAL_PART)) : null;
      item.debit = item.debit ? Number(item.debit.toFixed(DECIMAL_PART)) : null;

      const openingI = item.obCredit ?? item.obDebit;
      item.opening = openingI ? `${openingI.toFixed(DECIMAL_PART)} ${item.obCredit ? 'Cr' : 'Dr'}` : '';

      const balanceI = (item.credit ?? 0) + (item.obCredit ?? 0) - (item.debit ?? 0) - (item.obDebit ?? 0);
      item.balance = balanceI ? `${Math.abs(balanceI).toFixed(DECIMAL_PART)} ${balanceI > 0 ? 'Cr' : 'Dr'}` : '';

    });
    return plItems;

  }

  generateLedgerGroupReport = async(ason: Date, plid: string): Promise<LedgerReportItem[]> => {

    const lidsD = await this.ledgerService.findLedgerIdsOfGroup(plid);
    const items = await this.voucherService.generateLedgerGroupReport(ason, lidsD.lids);
    for (const item of items) {

      item.credit = item.credit ? Number(item.credit.toFixed(DECIMAL_PART)) : null;
      item.debit = item.debit ? Number(item.debit.toFixed(DECIMAL_PART)) : null;

    }
    return items;

  }

  generateLedgerReport = async(ason: Date, plid: string, clid?: string): Promise<LedgerReportItem[]> => {

    const items = await this.voucherService.generateLedgerReport(ason, plid, clid);
    for (const item of items) {

      item.credit = item.credit ? Number(item.credit.toFixed(DECIMAL_PART)) : null;
      item.debit = item.debit ? Number(item.debit.toFixed(DECIMAL_PART)) : null;

    }
    return items;

  }

  generateBalanceSheet = async(ason: Date):Promise<Array<BalanceSheetItem>> => {

    const plItems = await this.generateBalanceSheetReport(ason);
    return plItems.bItems;

  }

  generateProfitLoss = async(ason: Date):Promise<Array<BalanceSheetItem>> => {

    const plItems = await this.generateProfitLossReport(ason);
    return plItems.bItems;

  }

  generateTrialBalance = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const lGsWithChildrenU = await this.ledgerGroupService.findLedgerGroupsWithChildren() as unknown;
    const lGsWithChildren = lGsWithChildrenU as Array<TrialBalanceItem>;
    const lGMap:Record<string, TrialBalanceItem> = {};
    this.fillLGMap(lGMap, lGsWithChildren);
    const lSumm = await this.voucherService.generateLedgerSummary(ason);
    this.fillTreeWithLedger(lSumm, lGMap);
    this.fillTreeWithLedgerGroups(lSumm, lGMap);
    const nonEmptyItems = this.removeEmptyItems(lGsWithChildren);
    const totalItem = this.findSummary(lSumm);
    return [ ...nonEmptyItems, totalItem ];

  }

}
