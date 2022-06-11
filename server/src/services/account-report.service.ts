import {injectable, BindingScope, service} from '@loopback/core';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { LedgerSummaryTB } from '@shared/util/trial-balance-ledger-summary';
import { LedgerGroup } from '../models';
import { LedgerGroupService } from './ledger-group.service';
import { VoucherService } from './voucher.service';

// Get decimal place count from user session.
const decimal = 2;

@injectable({scope: BindingScope.TRANSIENT})
export class AccountReportService {

  constructor(
    @service(VoucherService) public voucherService: VoucherService,
    @service(LedgerGroupService) public ledgerGroupService: LedgerGroupService,
  ) {}


  private createSingleItem = (lItem: string, lAmount: string, rItem: string, rAmount: string):BalanceSheetItem => ({
    lItem,
    lAmount,
    rItem,
    rAmount
  })

  private generateReport =(leftLGs: Array<LedgerGroup>, rightLGs: Array<LedgerGroup>,
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
        const amount = ldGMap[ldG.id].debit ?? 0 - ldGMap[ldG.id].credit ?? 0;
        totalLeft += amount;
        item.lItem = ldG.name;
        item.lAmount = amount.toFixed(decimal);

      }
      if (idx < rightLGs.length) {

        const ldG = rightLGs[idx];
        const amount = ldGMap[ldG.id].credit ?? 0 - ldGMap[ldG.id].debit ?? 0;
        totalRight += amount;
        item.rItem = ldG.name;
        item.rAmount = amount.toFixed(decimal);

      }

    }
    return {bItems,
      totalLeft,
      totalRight};

  }

  private findLedgerGroupSummaryMap =
  (filtTBs: Array<LedgerSummaryTB>): Record<string, {debit: number, credit: number}> => {

    const ldGMap:Record<string, {debit: number, credit: number}> = {};
    for (const summTB of filtTBs) {

      const ldgId = summTB.ledgerGroupId;
      ldGMap[ldgId] = ldGMap[ldgId] ?? {debit: 0,
        credit: 0};
      ldGMap[ldgId].credit += summTB.credit;
      ldGMap[ldgId].debit += summTB.debit;
      summTB.obType === 'Credit' ? ldGMap[ldgId].credit += summTB.obAmount : ldGMap[ldgId].debit += summTB.obAmount;

    }
    return ldGMap;

  }

  private generateTradingReport =
  (lgsWithParents:Array<LedgerGroup & {parents: Array<LedgerGroup>}>,
    ldGMap:Record<string, {debit: number, credit: number}>):
    {bItems: Array<BalanceSheetItem>, isProfit: boolean, profLoss: number} => {

    const bItems: Array<BalanceSheetItem> = [];
    const dirIncomeLdGs = lgsWithParents.filter((ldG) => ldG.code === 'DIRINCM' || ldG.parents.find((lgP) => lgP.code === 'DIRINCM'));
    const dirExpenseLdGs = lgsWithParents.filter((ldG) => ldG.code === 'DIREXPNS' || ldG.parents.find((lgP) => lgP.code === 'DIREXPNS'));
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

  private generatePLReport =
  (lgsWithParents:Array<LedgerGroup & {parents: Array<LedgerGroup>}>,
    ldGMap:Record<string, {debit: number, credit: number}>, isGProfit: boolean, profLossG: number):
    {bItems: Array<BalanceSheetItem>, isProfit: boolean, profLoss: number} => {

    const bItems: Array<BalanceSheetItem> = [];
    bItems.push(this.createSingleItem(!isGProfit ? 'Gross loss' : '', !isGProfit ? profLossG.toFixed(decimal) : '', isGProfit ? 'Gross profit' : '', isGProfit ? profLossG.toFixed(decimal) : ''));
    const inDirIncomeLdGs = lgsWithParents.filter((ldG) => ldG.code === 'IDRINC' || ldG.parents.find((lgP) => lgP.code === 'IDRINC'));
    const inDirExpenseLdGs = lgsWithParents.filter((ldG) => ldG.code === 'IDIREXPNS' || ldG.parents.find((lgP) => lgP.code === 'IDIREXPNS'));
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
    const filtTBs = summTBs.filter((summTB) => summTB.credit - summTB.debit + (summTB.obType === 'Credit' ? 1 : -1) * summTB.obAmount !== 0);
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

  generateBalanceSheet = async(ason: Date):Promise<Array<BalanceSheetItem>> => {

    const plItems = await this.generateProfitLossReport(ason);
    return plItems.bItems;

  }

  generateProfitLoss = async(ason: Date):Promise<Array<BalanceSheetItem>> => {

    const plItems = await this.generateProfitLossReport(ason);
    return plItems.bItems;

  }

}
