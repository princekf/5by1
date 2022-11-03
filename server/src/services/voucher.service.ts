import {injectable, BindingScope} from '@loopback/core';
import { Count, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { DayBookItem } from '@shared/util/day-book-item';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { Ledger, Voucher, Transaction, FinYear } from '../models';
import { FinYearRepository, LedgerRepository, VoucherRepository } from '../repositories';
import { VoucherServiceUtil } from './util/voucher.service.util';
import { ProfileUser } from '../services';
import { HttpErrors, Request, Response } from '@loopback/rest';
import { FileUploadHandler } from '../types';
import { VoucherImport } from '../utils/voucher-import-spec';
import xlsx from 'xlsx';
import { TransactionType } from '@shared/entity/accounting/transaction';
import dayjs from 'dayjs';


@injectable({scope: BindingScope.TRANSIENT})
export class VoucherService {

  constructor(
    @repository(VoucherRepository)
    public voucherRepository : VoucherRepository,) {}

  generateLedgerGroupSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...VoucherServiceUtil.ledgerGroupSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<TrialBalanceItem>> await pQuery.toArray();
    return res;

  }

  generateLedgerSummary = async(startDate: Date, endDate: Date):Promise<Array<TrialBalanceItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': endDate,
      '$gte': startDate, } } }, ...VoucherServiceUtil.ledgerSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<TrialBalanceItem>> await pQuery.toArray();
    return res;

  }

  listVouchersWithDetails = async(startDate: Date, endDate: Date):Promise<Array<DayBookItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': endDate,
      '$gte': startDate } } }, ...VoucherServiceUtil.dayBookAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<DayBookItem>> await pQuery.toArray();
    return res;

  }

  generateLedgerGroupReport = async(ason: Date, plids: string[]): Promise<LedgerReportItem[]> => {

    const ledgerReportAggs = VoucherServiceUtil.createLedgerGroupReportAggregates(plids);
    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...ledgerReportAggs, {
      '$project': {
        'id': 1,
        'number': 1,
        'date': 1,
        'type': 1,
        'details': 1,
        'pname': '$pledgers.name',
        'name': '$ledgers.name',
        'credit': {'$cond': [ {'$eq': [ '$tType', 'Debit' ]}, '$amount', 0 ]},
        'debit': {'$cond': [ {'$eq': [ '$tType', 'Credit' ]}, '$amount', 0 ]},
      }
    },
    {
      '$sort': { 'date': 1 }
    }, ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerReportItem>> await pQuery.toArray();
    return res;

  }

  generateLedgerReport = async(startDate: Date, endDate: Date, plid: string, clid?: string):
  Promise<LedgerReportItem[]> => {

    const ledgerReportAggs = VoucherServiceUtil.createLedgerReportAggregates(plid, clid);
    const aggregates = [ { '$match': { 'date': { '$lte': endDate,
      '$gte': startDate } } }, ...ledgerReportAggs ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerReportItem>> await pQuery.toArray();
    return res;

  }

  create = async(voucher: Omit<Voucher, 'id'>,
    uProfile: ProfileUser,
    finYearRepository : FinYearRepository,): Promise<Voucher> => {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    if (!finYear) {

      throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

    }
    const otherDetails = finYear.extras as {lastVNo:number};
    const lastVNo = otherDetails?.lastVNo ?? 0;
    const nextVNo = lastVNo + 1;
    if (!voucher.number) {

      voucher.number = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();

    }
    const voucherR = await this.voucherRepository.create(voucher);
    await finYearRepository.updateById(finYear.id, {extras: {lastVNo: nextVNo}});
    return voucherR;

  }

  count = async(where?: Where<Voucher>): Promise<Count> => {

    const countR = await this.voucherRepository.count(where);
    return countR;

  }

  find = async(filter?: Filter<Voucher>): Promise<Voucher[]> => {

    const vouchersR = await this.voucherRepository.find(filter);
    return vouchersR;

  }

  ledgersUsed = async(vType: string,): Promise<Ledger[]> => {

    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', VoucherServiceUtil.createLedgersByVTypeAggr(vType));
    const toArr = await pQuery.toArray();
    return toArr;

  }

  updateAll = async(voucher: Voucher, where?: Where<Voucher>,): Promise<Count> => {

    const countR = await this.voucherRepository.updateAll(voucher, where);
    return countR;

  }

  findById = async(
    id: string,
    filter?: FilterExcludingWhere<Voucher>
  ): Promise<Voucher> => {

    const voucherR = await this.voucherRepository.findById(id, filter);
    return voucherR;

  }

  updateById = async(
    id: string, voucher: Voucher,
  ): Promise<void> => {

    await this.voucherRepository.updateById(id, voucher);

  }

   replaceById = async(id: string, voucher: Voucher,): Promise<void> => {

     await this.voucherRepository.replaceById(id, voucher);

   }

  deleteById = async(id: string): Promise<void> => {

    await this.voucherRepository.deleteById(id);

  }

  deleteAll = async(where?: Where<Voucher>,): Promise<Count> => {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Voucher ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Voucher ids are required');

    }

    const count = await this.voucherRepository.deleteAll(where);
    return count;

  }

  private extractVoucherData = (vouchersData:Array<VoucherImport>)
  :[Array<string>] => {

    const lCodes:Array<string> = [];
    vouchersData.forEach((vData) => {

      if (vData.PrimaryLedger && !lCodes.includes(vData.PrimaryLedger)) {

        lCodes.push(vData.PrimaryLedger);

      }

      if (vData.CompoundLedger && !lCodes.includes(vData.CompoundLedger)) {

        lCodes.push(vData.CompoundLedger);

      }

    });
    return [ lCodes ];

  }


  private findLedgerMap = async(ledgerRepository:LedgerRepository, lCodes: Array<string>)
  :Promise<Record<string, Ledger>> => {

    const ledgers = await ledgerRepository.find({where: {code: {inq: lCodes}}});
    const ledgerMap:Record<string, Ledger> = {};
    ledgers.forEach((ldgr) => (ledgerMap[ldgr.code] = ldgr));
    const invalidLCodes = lCodes.filter((lcd) => !ledgerMap[lcd]);
    if (invalidLCodes && invalidLCodes.length) {

      throw new HttpErrors.UnprocessableEntity(`The following ledger codes are invalid ${JSON.stringify(invalidLCodes)}`);

    }
    return ledgerMap;

  }

  private validateInputs = (finYear: FinYear, rowNum: number, vData: VoucherImport) => {

    const {startDate, endDate} = finYear;
    const dayJsDate = dayjs.utc(vData.Date, 'DD-MM-YYYY');
    if (!dayJsDate.isValid()) {

      throw new HttpErrors.UnprocessableEntity(`Please select a proper date for ${vData.Date}, ${vData.PrimaryLedger} at row ${rowNum + 1}.`);

    }
    const date = dayJsDate.toDate();
    if (date < startDate || date > endDate) {

      throw new HttpErrors.UnprocessableEntity(`Date should be within the fin year, ${vData.Date} a row ${rowNum + 1}`);

    }
    if (vData.Credit > 0 && vData.Debit > 0) {

      throw new HttpErrors.UnprocessableEntity(`Both credit and debit cannot be greater than 0 at a time, ${vData.Date} a row ${rowNum + 1}`);

    }
    if (vData.Credit <= 0 && vData.Debit <= 0) {

      throw new HttpErrors.UnprocessableEntity(`One and only one of debit or credit should be greater than 0, ${vData.Date} a row ${rowNum + 1}`);

    }

  }

  private extractSimpleComplexVoucherData =
  (finYear: FinYear, vouchersData:Array<VoucherImport>)
  : {compoundVData:Record<string, Array<VoucherImport>>, simepleVData:Array<VoucherImport>} => {

    const compoundVData:Record<string, Array<VoucherImport>> = {};
    const simepleVData:Array<VoucherImport> = [];


    for (const [ rowNum, vData ] of vouchersData.entries()) {

      this.validateInputs(finYear, rowNum, vData);

      if (vData.GroupCode) {


        if (!compoundVData[vData.GroupCode]) {

          compoundVData[vData.GroupCode] = [];
          compoundVData[vData.GroupCode].push(vData);

        } else {

          const [ vData0 ] = compoundVData[vData.GroupCode];
          if (vData0.Date !== vData.Date || vData0.PrimaryLedger !== vData.PrimaryLedger) {

            throw new HttpErrors.UnprocessableEntity(`Date and primary ledger should be same for compound ledgers, ${vData.Date} a row ${rowNum + 1}`);

          }
          if (!vData.Credit && vData0.Credit) {

            throw new HttpErrors.UnprocessableEntity(`Compound ledgers can have either debit value or credit value, ${vData.Date} a row ${rowNum + 1}`);

          }
          if (!vData.Debit && vData0.Debit) {

            throw new HttpErrors.UnprocessableEntity(`Compound ledgers can have either debit value or credit value, ${vData.Date} a row ${rowNum + 1}`);

          }
          compoundVData[vData.GroupCode].push(vData);

        }

      } else {

        simepleVData.push(vData);

      }

    }
    return {
      compoundVData,
      simepleVData
    };

  }

  private createSingleVoucher = async(uProfile: ProfileUser, finYearRepository : FinYearRepository,
    voucher: Partial<Voucher>, pTransaction:Partial<Transaction>, cTransaction:Array<Partial<Transaction>>) => {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    const otherDetails = finYear?.extras as {lastVNo:number};
    const lastVNo = otherDetails?.lastVNo ?? 0;
    const nextVNo = lastVNo + 1;
    const nextVNoS = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();
    await this.voucherRepository.create({
      ...voucher,
      number: nextVNoS,
      transactions: [ pTransaction, ...cTransaction ]
    });
    await finYearRepository.updateById(finYear?.id ?? '', {extras: {lastVNo: nextVNo}});

  }

  private saveSimpleVData = (simepleVData:Array<VoucherImport>, ledgerMap: Record<string, Ledger>,
    uProfile: ProfileUser, finYearRepository : FinYearRepository) => {

    simepleVData.forEach(async(vData) => {

      const date = dayjs.utc(vData.Date, 'DD-MM-YYYY')
        .toDate();
      const details = vData.Details;
      const type = VoucherServiceUtil.findVoucherType(vData.VoucherType);
      const pType = vData.Credit > 0 ? TransactionType.CREDIT : TransactionType.DEBIT;
      const cType = vData.Credit > 0 ? TransactionType.DEBIT : TransactionType.CREDIT;
      const amount = vData.Credit > 0 ? vData.Credit : vData.Debit;
      const pTransaction:Partial<Transaction> = {
        type: pType,
        order: 1,
        ledgerId: ledgerMap[vData.PrimaryLedger].id,
        amount,
      };
      const cTransaction:Partial<Transaction> = {
        type: cType,
        order: 2,
        ledgerId: ledgerMap[vData.CompoundLedger].id,
        amount,
      };

      const voucher: Partial<Voucher> = {
        details,
        date,
        type,
      };
      await this.createSingleVoucher(uProfile, finYearRepository, voucher, pTransaction, [ cTransaction ]);

    });

  }

  private findCTransactions = (cType: TransactionType, compVDatas: Array<VoucherImport>, lgMap: Record<string, Ledger>)
  : [Array<Partial<Transaction>>, number, number] => {

    const cTransactions:Array<Partial<Transaction>> = [];
    let totalCredit = 0;
    let totalDebit = 0;
    for (const [ idx, compVData ] of compVDatas.entries()) {

      totalCredit += compVData.Credit;
      totalDebit += compVData.Debit;
      const amount = compVData.Credit > 0 ? compVData.Credit : compVData.Debit;
      const orderStart = 2;
      const cTransaction:Partial<Transaction> = {
        type: cType,
        order: orderStart + idx,
        ledgerId: lgMap[compVData.CompoundLedger].id,
        amount,
      };
      cTransactions.push(cTransaction);

    }
    return [ cTransactions, totalDebit, totalCredit ];

  }

  private saveCompoundVData = async(compoundVData:Record<string, Array<VoucherImport>>,
    ledgerMap: Record<string, Ledger>, uProfile: ProfileUser, finYearRepository : FinYearRepository) => {

    for (const groupId in compoundVData) {

      if (!compoundVData.hasOwnProperty(groupId)) {

        continue;

      }
      const compVDatas = compoundVData[groupId];
      const [ vData ] = compVDatas;
      const pType = vData.Credit > 0 ? TransactionType.CREDIT : TransactionType.DEBIT;
      const cType = vData.Credit > 0 ? TransactionType.DEBIT : TransactionType.CREDIT;

      const [ cTransactions, totalDebit, totalCredit ] = this.findCTransactions(cType, compVDatas, ledgerMap);
      const date = dayjs.utc(vData.Date, 'DD-MM-YYYY')
        .toDate();
      const details = vData.Details;
      const type = VoucherServiceUtil.findVoucherType(vData.VoucherType);
      const amount: number = totalCredit > 0 ? totalCredit : totalDebit;
      const pTransaction:Partial<Transaction> = {
        type: pType,
        order: 1,
        ledgerId: ledgerMap[vData.PrimaryLedger].id,
        amount: Number(amount.toFixed(2)),
      };
      const voucher: Partial<Voucher> = {
        details,
        date,
        type,
      };
      await this.createSingleVoucher(uProfile, finYearRepository, voucher, pTransaction, cTransactions);

    }

  }

  private createVouchers = async(vouchersData:Array<VoucherImport>, ledgerMap: Record<string, Ledger>,
    uProfile: ProfileUser, finYearRepository : FinYearRepository)
    :Promise<void> => {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    if (!finYear) {

      throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

    }
    const {compoundVData, simepleVData} = this.extractSimpleComplexVoucherData(finYear, vouchersData);
    await this.saveSimpleVData(simepleVData, ledgerMap, uProfile, finYearRepository);
    await this.saveCompoundVData(compoundVData, ledgerMap, uProfile, finYearRepository);

  }

   importVouchers = async(
     request: Request,
     response2: Response,
     fileUploadHandler: FileUploadHandler,
     uProfile: ProfileUser,
     finYearRepository : FinYearRepository,
     ledgerRepository : LedgerRepository,
   ): Promise<Array<VoucherImport>> => {

     await VoucherServiceUtil.saveUploadedFile(fileUploadHandler, request, response2);
     const [ fileDetails ] = request.files as Array<{path: string}>;
     const savedFilePath = fileDetails.path;
     const workBook = xlsx.readFile(savedFilePath);
     const sheetNames = workBook.SheetNames;
     const vouchersData:Array<VoucherImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
     const [ lCodes ] = this.extractVoucherData(vouchersData);
     const ledgerMap = await this.findLedgerMap(ledgerRepository, lCodes);
     await this.createVouchers(vouchersData, ledgerMap, uProfile, finYearRepository);
     return vouchersData;

   }

}
