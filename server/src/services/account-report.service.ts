import {injectable, BindingScope, service} from '@loopback/core';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { LedgerGroupService } from './ledger-group.service';
import { VoucherService } from './voucher.service';
import { LedgerGroup as LedgerGroupIntf } from '@shared/entity/accounting/ledger-group';
import { DECIMAL_PART, fboServerUtil } from '../utils/fbo-server-util';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { LedgerService } from './ledger.service';
import { DayBookItem } from '@shared/util/day-book-item';
import dayjs from 'dayjs';
import { LedgerGroup } from '../models';

interface BSOneSide {
  name: string;
  amount: string;
}

interface BLReportResp {
  bItems: Array<BalanceSheetItem>;
  isProfit: boolean;
  profLoss: number;
}
@injectable({scope: BindingScope.TRANSIENT})
export class AccountReportService {

  constructor(
    @service(VoucherService) private voucherService: VoucherService,
    @service(LedgerGroupService) private ledgerGroupService: LedgerGroupService,
    @service(LedgerService) private ledgerService: LedgerService,
  ) {}


  private createSingleItem = (lItem: string, lAmount: string, rItem: string, rAmount: string):BalanceSheetItem => ({
    lItem,
    lAmount,
    rItem,
    rAmount
  })

  private generateBalanceSheetItems =
  (ldgGroups:LedgerGroup[], parentId: string, ledgers: TrialBalanceItem[], level: number, sign: 1 | -1)
  :{items: Array<BSOneSide>, total:number} => {

    const items:BSOneSide[] = [];
    let total = 0;
    for (const group of ldgGroups) {

      if (group.parentId === parentId) {

        const nextVals = this.generateBalanceSheetItems(ldgGroups, group.id, ledgers, level + 1, sign);
        if (nextVals.items.length) {

          items.push({name: `${'  '.repeat(level)}${group.name}`,
            amount: ''});
          items.push(...nextVals.items);
          total += nextVals.total;

        }

      }

    }

    for (const ldg of ledgers) {

      if (ldg.parentId === parentId) {

        const amount = ((ldg.credit ?? 0) + (ldg.obCredit ?? 0) - (ldg.debit ?? 0) - (ldg.obDebit ?? 0)) * sign;
        total += amount;
        items.push({name: `${'  '.repeat(level)}${ldg.name}`,
          amount: amount.toFixed(DECIMAL_PART)});

      }

    }
    return {items,
      total};

  }

  private createBLItems = (lItems: BSOneSide[], rItems: BSOneSide[]):BalanceSheetItem[] => {

    const bItems:BalanceSheetItem[] = [];
    for (let idx = 0; idx < lItems.length || idx < rItems.length; idx++) {

      const item: BalanceSheetItem = {
        lItem: '',
        lAmount: '',
        rItem: '',
        rAmount: ''
      };
      bItems.push(item);
      if (idx < lItems.length) {

        const lItem = lItems[idx];
        item.lItem = lItem.name;
        item.lAmount = lItem.amount;

      }
      if (idx < rItems.length) {

        const rItem = rItems[idx];
        item.rItem = rItem.name;
        item.rAmount = rItem.amount;

      }

    }
    return bItems;

  }

  private generateBLReportItems =
  (ldGrps: LedgerGroup[], filTBs: TrialBalanceItem[], leftItems: LedgerGroup[], rightItems: LedgerGroup[])
  :{bItems: BalanceSheetItem[], lTotal: number, rTotal: number} => {

    const lPLItems:Array<BSOneSide> = [];
    const rPLItems:Array<BSOneSide> = [];
    const bItems: Array<BalanceSheetItem> = [];
    let lTotal = 0;
    let rTotal = 0;
    for (const leftItem of leftItems) {

      const lItemsRespPL = this.generateBalanceSheetItems(ldGrps, leftItem.id ?? '', filTBs, 0, -1);
      lPLItems.push(...lItemsRespPL.items);
      lTotal += lItemsRespPL.total;

    }
    for (const rightItem of rightItems) {

      const rItemsRespPL = this.generateBalanceSheetItems(ldGrps, rightItem.id ?? '', filTBs, 0, 1);
      rPLItems.push(...rItemsRespPL.items);
      rTotal += rItemsRespPL.total;

    }
    bItems.push(...this.createBLItems(lPLItems, rPLItems));

    return {
      bItems,
      lTotal,
      rTotal
    };

  }

  private generatePLFinalReport = (isGProfit: boolean, profLossG: number, ldGrps: LedgerGroup[],
    filTBs: TrialBalanceItem[], dirExpGrp?: LedgerGroup, dirIncomeGrp?: LedgerGroup): BLReportResp => {

    const bItems: BalanceSheetItem[] = [];
    const pLGS = profLossG.toFixed(DECIMAL_PART);
    bItems.push(this.createSingleItem('P&L Report', '', '', ''));
    bItems.push(this.createSingleItem(!isGProfit ? 'Gross loss' : '', !isGProfit ? pLGS : '', isGProfit ? 'Gross profit' : '', isGProfit ? pLGS : ''));
    const expnId = dirExpGrp?.parentId;
    const incodeId = dirIncomeGrp?.parentId;
    const inDirExpenses = ldGrps.filter((ldG) => ldG.code !== 'DIREXPNS' && ldG.parentId === expnId);
    const inDirIncomes = ldGrps.filter((ldG) => ldG.code !== 'DIRINCM' && ldG.parentId === incodeId);
    const trBSItems = this.generateBLReportItems(ldGrps, filTBs, inDirExpenses, inDirIncomes);
    const lPLTotal = isGProfit ? trBSItems.lTotal : profLossG + trBSItems.lTotal;
    const rPLTotal = isGProfit ? profLossG + trBSItems.rTotal : trBSItems.rTotal;
    bItems.push(...trBSItems.bItems);
    const isProfit = rPLTotal > lPLTotal;
    const profLoss = Math.abs(rPLTotal - lPLTotal);
    const plNS = profLoss.toFixed(DECIMAL_PART);
    bItems.push(this.createSingleItem(isProfit ? '' : 'Net loss', isProfit ? '' : plNS, isProfit ? 'Net Profit' : '', isProfit ? plNS : ''));
    return {
      bItems,
      isProfit,
      profLoss
    };

  }

  private generatePLReportFromSummary = (ldGrps: LedgerGroup[], filTBs: TrialBalanceItem[]):BLReportResp => {

    const dirExpGrp = ldGrps.find((ldG) => ldG.code === 'DIREXPNS');
    const lItemsRespTr = this.generateBalanceSheetItems(ldGrps, dirExpGrp?.id ?? '', filTBs, 0, -1);
    const dirIncomeGrp = ldGrps.find((ldG) => ldG.code === 'DIRINCM');
    const rItemsRespTr = this.generateBalanceSheetItems(ldGrps, dirIncomeGrp?.id ?? '', filTBs, 0, 1);
    const bItems: Array<BalanceSheetItem> = [];
    bItems.push(this.createSingleItem('Trading Report', '', '', ''));
    bItems.push(...this.createBLItems(lItemsRespTr.items, rItemsRespTr.items));

    const isGProfit = rItemsRespTr.total > lItemsRespTr.total;
    const profLossG = Math.abs(rItemsRespTr.total - lItemsRespTr.total);
    const pLGS = profLossG.toFixed(DECIMAL_PART);
    bItems.push(this.createSingleItem(isGProfit ? 'Gross profit' : '', isGProfit ? pLGS : '', !isGProfit ? 'Gross loss' : '', !isGProfit ? pLGS : ''));
    const plFinalItems = this.generatePLFinalReport(isGProfit, profLossG, ldGrps, filTBs, dirExpGrp, dirIncomeGrp);
    bItems.push(...plFinalItems.bItems);
    return {bItems,
      isProfit: plFinalItems.isProfit,
      profLoss: plFinalItems.profLoss};

  }

  private generateProfitLossReport = async(startDate: Date, endDate: Date):
  Promise<BLReportResp> => {

    const smT = await this.voucherService.generateLedgerSummary(startDate, endDate);
    // Filter the ledgers with balance
    const filTBs = smT.filter((sTB) => (sTB.credit ?? 0) - (sTB.debit ?? 0) + (sTB.obCredit ?? 0) - (sTB.obDebit ?? 0));
    // Create id-name map.
    const idName: Record<string, string> = {};
    filTBs.forEach((item) => (idName[item.id] = item.name));
    const ldGrps = await this.ledgerGroupService.find();
    return this.generatePLReportFromSummary(ldGrps, filTBs);

  }


  private generateBalanceSheetReport = async(startDate: Date, endDate: Date):
  Promise<Array<BalanceSheetItem>> => {

    const smT = await this.voucherService.generateLedgerSummary(startDate, endDate);
    // Filter the ledgers with balance
    const filTBs = smT.filter((sTB) => (sTB.credit ?? 0) - (sTB.debit ?? 0) + (sTB.obCredit ?? 0) - (sTB.obDebit ?? 0));
    // Create id-name map.
    const idName: Record<string, string> = {};
    filTBs.forEach((item) => (idName[item.id] = item.name));
    const ldGrps = await this.ledgerGroupService.find();
    // Find all ledger which don't have transactions but opening balance.
    const lIds = smT.map((lsu) => lsu.id);
    const ldGNTs = await this.findAllTBItemsWithNoTransactionButOpening(lIds);
    filTBs.push(...ldGNTs);
    const profLossR = this.generatePLReportFromSummary(ldGrps, filTBs);
    const assetsGrp = ldGrps.filter((ldG) => ldG.code === 'ASTS');
    const lbltsGrp = ldGrps.filter((ldG) => ldG.code === 'LBLTS');
    const {bItems, lTotal, rTotal} = this.generateBLReportItems(ldGrps, filTBs, assetsGrp, lbltsGrp);
    const isPL = profLossR.isProfit;
    const pLGS = profLossR.profLoss.toFixed(DECIMAL_PART);
    bItems.push(this.createSingleItem(isPL ? '' : 'Net Loss', isPL ? '' : pLGS, isPL ? 'Net Profit' : '', isPL ? 'pLGS' : ''));
    const lBLTotal = (lTotal + (isPL ? 0 : profLossR.profLoss)).toFixed(DECIMAL_PART);
    const rBLTotal = (rTotal + (isPL ? profLossR.profLoss : 0)).toFixed(DECIMAL_PART);
    bItems.push({
      lItem: 'Total',
      lAmount: lBLTotal,
      rItem: 'Total',
      rAmount: rBLTotal
    });
    return bItems;

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
      ldS.closeCredit = Number((ldS.closeCredit ?? 0).toFixed(DECIMAL_PART));
      ldS.closeDebit = Number((ldS.closeDebit ?? 0).toFixed(DECIMAL_PART));
      lGMap[ldS.parentId].children = lGMap[ldS.parentId].children ?? [];
      lGMap[ldS.parentId].children.push(ldS);

    }

  }

    private fillTreeWithLedgerGroups = (lSumm: Array<TrialBalanceItem>, lGMap:Record<string, TrialBalanceItem>) => {


      for (const ldS of lSumm) {

        let parent = lGMap[ldS.parentId];
        while (parent) {

          parent.credit = Number(((ldS.credit || 0) + (parent.credit || 0)).toFixed(DECIMAL_PART));
          parent.debit = Number(((ldS.debit || 0) + (parent.debit || 0)).toFixed(DECIMAL_PART));
          parent.obCredit = Number(((ldS.obCredit || 0) + (parent.obCredit || 0)).toFixed(DECIMAL_PART));
          parent.obDebit = Number(((ldS.obDebit || 0) + (parent.obDebit || 0)).toFixed(DECIMAL_PART));
          parent.closeCredit = Number(((ldS.closeCredit || 0) + (parent.closeCredit || 0)).toFixed(DECIMAL_PART));
          parent.closeDebit = Number(((ldS.closeDebit || 0) + (parent.closeDebit || 0)).toFixed(DECIMAL_PART));
          parent = lGMap[parent.parentId];

        }

      }

    }

  private findSummary = (items: Array<TrialBalanceItem>): TrialBalanceItem => {

    let credit = 0;
    let debit = 0;
    let obCredit = 0;
    let obDebit = 0;
    let closeCredit = 0;
    let closeDebit = 0;
    for (const item of items) {

      credit += item.credit ?? 0;
      debit += item.debit ?? 0;
      obCredit += item.obCredit ?? 0;
      obDebit += item.obDebit ?? 0;
      closeCredit += item.closeCredit ?? 0;
      closeDebit += item.closeDebit ?? 0;

    }
    return {
      id: '',
      parentId: '',
      name: 'Total',
      code: '',
      credit: Number(credit.toFixed(DECIMAL_PART)),
      debit: Number(debit.toFixed(DECIMAL_PART)),
      obCredit: Number(obCredit.toFixed(DECIMAL_PART)),
      obDebit: Number(obDebit.toFixed(DECIMAL_PART)),
      closeCredit: Number(closeCredit.toFixed(DECIMAL_PART)),
      closeDebit: Number(closeDebit.toFixed(DECIMAL_PART)),
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

  private findAllTBItemsWithNoTransactionButOpening = async(lIds: Array<string>): Promise<Array<TrialBalanceItem>> => {

    const ldgNTs = await this.ledgerService.find({where: {
      id: {nin: lIds},
      obAmount: {gt: 0}
    }});
    const lSumm: Array<TrialBalanceItem> = [];
    ldgNTs.forEach((ldgNT) => {

      const {name, code, ledgerGroupId, id, obAmount, obType} = ldgNT;
      lSumm.push({
        id,
        parentId: ledgerGroupId,
        name,
        code,
        obCredit: obType === 'Credit' ? obAmount : 0,
        obDebit: obType === 'Debit' ? obAmount : 0,
        children: []
      });

    });
    return lSumm;

  }

  ledgerGroupSummary = async(asonI: Date):Promise<Array<TrialBalanceItem>> => {

    const ason = fboServerUtil.updateTimeToMaximum(asonI);
    const plItems = await this.voucherService.generateLedgerGroupSummary(ason);
    plItems.forEach((item) => {

      item.credit = Number(item.credit?.toFixed(DECIMAL_PART));
      item.debit = Number(item.debit?.toFixed(DECIMAL_PART));

    });
    return plItems;

  }

  generateLedgerSummary = async(startDateI: Date, endDateI: Date):Promise<Array<TrialBalanceItem>> => {

    const startDate = fboServerUtil.updateTimeToMinimum(startDateI);
    const endDate = fboServerUtil.updateTimeToMaximum(endDateI);
    const plItems2 = await this.voucherService.generateLedgerSummary(startDate, endDate);
    const lids = plItems2.map((item) => item.id);

    const ldGNts = await this.findAllTBItemsWithNoTransactionButOpening(lids);
    const plItems = [ ...plItems2, ...ldGNts ];
    plItems.forEach((item) => {

      item.credit = Number(item.credit?.toFixed(DECIMAL_PART));
      item.debit = Number(item.debit?.toFixed(DECIMAL_PART));

    });
    return plItems;

  }

  generateLedgerGroupReport = async(asonI: Date, plid: string): Promise<LedgerReportItem[]> => {

    const ason = fboServerUtil.updateTimeToMaximum(asonI);
    const lidsD = await this.ledgerService.findLedgerIdsOfGroup(plid);
    const items = await this.voucherService.generateLedgerGroupReport(ason, lidsD.lids) as
    Array<Partial<LedgerReportItem>>;
    let totalDebit = 0;
    let totalCredit = 0;
    for (const item of items) {

      totalDebit += item?.debit ?? 0;
      totalCredit += item?.credit ?? 0;
      item.credit = item.credit ? Number(item.credit.toFixed(DECIMAL_PART)) : null;
      item.debit = item.debit ? Number(item.debit.toFixed(DECIMAL_PART)) : null;

    }
    const balance = totalCredit - totalDebit;
    items.push({
      name: 'Balance',
      debit: balance > 0 ? Number(balance.toFixed(DECIMAL_PART)) : null,
      credit: balance < 0 ? Number(Math.abs(balance).toFixed(DECIMAL_PART)) : null,
    });
    const total = totalCredit > totalDebit ? totalCredit : totalDebit;
    items.push({
      name: 'Total',
      debit: total,
      credit: total,
    });
    return items as LedgerReportItem[];

  }

  private alterItems = (opDebit: number, opCredit: number, items: Array<Partial<LedgerReportItem>>)
  : LedgerReportItem[] => {

    let totalDebit = 0;
    let totalCredit = 0;
    for (const item of items) {

      totalDebit += item?.debit ?? 0;
      totalCredit += item?.credit ?? 0;
      item.credit = item.credit ? Number(item.credit.toFixed(DECIMAL_PART)) : null;
      item.debit = item.debit ? Number(item.debit.toFixed(DECIMAL_PART)) : null;

    }
    items.push({
      name: 'Net Total',
      debit: totalDebit > 0 ? Number(totalDebit.toFixed(DECIMAL_PART)) : null,
      credit: totalCredit > 0 ? Number(Math.abs(totalCredit).toFixed(DECIMAL_PART)) : null,
    });
    items.push({
      name: 'Opening Balance',
      debit: opDebit ? Number(opDebit.toFixed(DECIMAL_PART)) : null,
      credit: opCredit ? Number(opCredit.toFixed(DECIMAL_PART)) : null,
    });
    const balance = totalCredit + opCredit - totalDebit - opDebit;
    items.push({
      name: 'Balance',
      debit: balance > 0 ? Number(balance.toFixed(DECIMAL_PART)) : null,
      credit: balance < 0 ? Number(Math.abs(balance).toFixed(DECIMAL_PART)) : null,
    });
    const grandTotalCr = totalCredit + opCredit;
    const grandTotalDr = totalDebit + opDebit;
    const total = grandTotalCr > grandTotalDr ? grandTotalCr : grandTotalDr;
    items.push({
      name: 'Gross Total',
      debit: Number(Math.abs(total).toFixed(DECIMAL_PART)),
      credit: Number(Math.abs(total).toFixed(DECIMAL_PART)),
    });

    return items as LedgerReportItem[];

  }

  generateLedgerReport = async(startDateI: Date, endDateI: Date, plid: string, clid?: string):
  Promise<LedgerReportItem[]> => {

    const endDate = fboServerUtil.updateTimeToMaximum(endDateI);
    const startDate = fboServerUtil.updateTimeToMinimum(startDateI);
    const NEG_TWO = -2;
    const opStartDate = dayjs(startDate).add(NEG_TWO, 'year')
      .toDate();
    const opEndDate = fboServerUtil.updateTimeToMaximum(dayjs(startDate).add(-1, 'day')
      .toDate());

    const items = await this.voucherService
      .generateLedgerReport(startDate, endDate, plid, clid) as Array<Partial<LedgerReportItem>>;
    const opItems = await this.voucherService
      .generateLedgerReport(opStartDate, opEndDate, plid) as Array<Partial<LedgerReportItem>>;
    const ledger = await this.ledgerService.findById(plid);
    let opDebit = ledger.obType === 'Debit' ? ledger.obAmount : 0;
    let opCredit = ledger.obType === 'Credit' ? ledger.obAmount : 0;
    for (const item of opItems) {

      opDebit += item.debit ?? 0;
      opCredit += item.credit ?? 0;

    }
    const itemsR = this.alterItems(opDebit, opCredit, items);
    return itemsR;

  }

  generateBalanceSheet = async(startDateI: Date, endDateI: Date):Promise<Array<BalanceSheetItem>> => {

    const startDate = fboServerUtil.updateTimeToMinimum(startDateI);
    const endDate = fboServerUtil.updateTimeToMaximum(endDateI);
    const plItems = await this.generateBalanceSheetReport(startDate, endDate);
    return plItems;

  }

  generateProfitLoss = async(startDateI: Date, endDateI: Date):Promise<Array<BalanceSheetItem>> => {

    const startDate = fboServerUtil.updateTimeToMinimum(startDateI);
    const endDate = fboServerUtil.updateTimeToMaximum(endDateI);
    const plItems = await this.generateProfitLossReport(startDate, endDate);
    return plItems.bItems;

  }

  generateTrialBalance = async(startDateI: Date, endDateI: Date):Promise<Array<TrialBalanceItem>> => {


    const startDate = fboServerUtil.updateTimeToMinimum(startDateI);
    const endDate = fboServerUtil.updateTimeToMaximum(endDateI);
    const lGsWithChildrenU = await this.ledgerGroupService.findLedgerGroupsWithChildren() as unknown;
    const lGsWithChildren = lGsWithChildrenU as Array<TrialBalanceItem>;
    const lGMap:Record<string, TrialBalanceItem> = {};
    this.fillLGMap(lGMap, lGsWithChildren);
    const lSummC = await this.voucherService.generateLedgerSummary(startDate, endDate);
    lSummC.forEach((lSumm) => {

      const closeCredit = (lSumm.credit ?? 0) + (lSumm.obCredit ?? 0);
      const closeDebit = (lSumm.debit ?? 0) + (lSumm.obDebit ?? 0);
      if (closeCredit > closeDebit) {

        lSumm.closeCredit = closeCredit - closeDebit;

      } else {

        lSumm.closeDebit = closeDebit - closeCredit;

      }

    });
    // Find all ledger which don't have transactions but opening balance.
    const lIds = lSummC.map((lsu) => lsu.id);
    const ldGNTs = await this.findAllTBItemsWithNoTransactionButOpening(lIds);
    ldGNTs.forEach((lSumm) => {

      lSumm.closeCredit = lSumm.obCredit;
      lSumm.closeDebit = lSumm.obDebit;

    });
    const lSumm = [ ...lSummC, ...ldGNTs ];
    this.fillTreeWithLedger(lSumm, lGMap);
    this.fillTreeWithLedgerGroups(lSumm, lGMap);
    const nonEmptyItems = this.removeEmptyItems(lGsWithChildren);
    const totalItem = this.findSummary(lSumm);
    const order = [ 'ASTS', 'LBLTS', 'INCM', 'EXPNS' ];
    nonEmptyItems.sort((it1, it2) => order.indexOf(it1.code) - order.indexOf(it2.code));
    return [ ...nonEmptyItems, totalItem ];

  }

  generateDayBook = async(startDateI: Date, endDateI: Date):Promise<Array<DayBookItem>> => {

    const startDate = fboServerUtil.updateTimeToMinimum(startDateI);
    const endDate = fboServerUtil.updateTimeToMaximum(endDateI);
    const vouchers = await this.voucherService.listVouchersWithDetails(startDate, endDate);
    const vMap:Record<string, DayBookItem> = {};
    const retVoucher:DayBookItem[] = [];
    for (const voucher of vouchers) {

      if (!vMap[voucher.voucherId]) {

        voucher.children = [];
        vMap[voucher.voucherId] = voucher;
        retVoucher.push(voucher);

      } else {

        vMap[voucher.voucherId].children.push(voucher);

      }

    }
    return retVoucher;

  }

}
