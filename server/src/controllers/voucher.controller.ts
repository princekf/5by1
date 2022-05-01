import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, RestBindings,
  Response, Request } from '@loopback/rest';
import {Voucher} from '../models/voucher.model';
import {VoucherRepository} from '../repositories/voucher.repository';
import { VOUCHER_API } from '@shared/server-apis';
import { LedgerSummaryTB } from '@shared/util/trial-balance-ledger-summary';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { ValidateVoucherInterceptor } from '../interceptors/validate-voucher.interceptor';
import { inject, intercept } from '@loopback/context';
import { ProfileUser } from '../services';
import {SecurityBindings} from '@loopback/security';
import { CostCentreRepository, FinYearRepository, LedgerRepository } from '../repositories';
import {FileUploadHandler} from '../types';
import { BindingKeys } from '../binding.keys';
import xlsx from 'xlsx';
import { VoucherImport } from '../utils/voucher-import-spec';
import { CostCentre, Ledger, Transaction } from '../models';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { TrialBalanceLedgerSummaryRespSchema } from './specs/common-specs';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class VoucherController {

  constructor(
    @repository(VoucherRepository)
    public voucherRepository : VoucherRepository,
  ) {}

  @intercept(ValidateVoucherInterceptor.BINDING_KEY)
  @post(VOUCHER_API)
  @response(200, {
    description: 'Voucher model instance',
    content: {'application/json': {schema: getModelSchemaRef(Voucher)}},
  })
  @authorize({resource: resourcePermissions.voucherCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Voucher, {
            title: 'NewVoucher',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      voucher: Omit<Voucher, 'id'>,
      @inject(SecurityBindings.USER) uProfile: ProfileUser,
      @repository(FinYearRepository)
      finYearRepository : FinYearRepository,
  ): Promise<Voucher> {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    if (!finYear) {

      throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

    }
    const otherDetails = finYear.extras as {lastVNo:number};
    const lastVNo = otherDetails?.lastVNo ?? 0;
    const nextVNo = lastVNo + 1;
    const nextVNoS = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();
    voucher.number = nextVNoS;
    const voucherR = await this.voucherRepository.create(voucher);
    await finYearRepository.updateById(finYear.id, {extras: {lastVNo: nextVNo}});
    return voucherR;

  }

  @get(`${VOUCHER_API}/count`)
  @response(200, {
    description: 'Voucher model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Voucher) where?: Where<Voucher>,
  ): Promise<Count> {

    const countR = await this.voucherRepository.count(where);
    return countR;

  }

  @get(VOUCHER_API)
  @response(200, {
    description: 'Array of Voucher model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Voucher, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Voucher) filter?: Filter<Voucher>,
  ): Promise<Voucher[]> {

    const vouchersR = await this.voucherRepository.find(filter);
    return vouchersR;

  }

  private ledgerSummaryAggregates = [
    {'$unwind': '$transactions'},
    {
      '$lookup':
 {
   'from': 'Ledger',
   'localField': 'transactions.ledgerId',
   'foreignField': '_id',
   'as': 'ledger'
 }
    },
    {'$unwind': '$ledger'},
    {
      '$group': {
        '_id': '$transactions.ledgerId',
        'debit': {'$sum': {
          '$switch': {
            'branches': [
              {
                'case': { '$eq': [ '$transactions.type', 'Debit' ] },
                'then': '$transactions.amount'
              }
            ],
            'default': 0
          }
        }},
        'credit': {'$sum': {
          '$switch': {
            'branches': [
              {
                'case': { '$eq': [ '$transactions.type', 'Credit' ] },
                'then': '$transactions.amount'
              }
            ],
            'default': 0
          }
        }},
        'ledgerId': {'$first': '$ledger._id'},
        'ledger': {'$first': '$ledger.name'},
        'ledgerGroupId': {'$first': '$ledger.ledgerGroupId'}
      }
    },
  ];

  @get(`${VOUCHER_API}/ledgerSummary`)
  @response(200, {
    description: 'Ledger summary for trial balance',
    content: {
      'application/json': {schema: TrialBalanceLedgerSummaryRespSchema},
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async ledgerSummary(): Promise<LedgerSummaryTB[]> {

    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', this.ledgerSummaryAggregates);
    const lgsR = <Array<LedgerSummaryTB>> await pQuery.toArray();
    return lgsR;

  }

  private createLedgersByVTypeAggr = (vType: string) => [
    {
      '$match': { type: vType }
    },

    { '$project': { 'ledgerId': '$transactions.ledgerId',
      '_id': 0 }},
    { '$unwind': '$ledgerId' },
    {'$group': {_id: '$ledgerId'}},
    {
      $lookup: {
        'from': 'Ledger',
        'localField': '_id',
        'foreignField': '_id',
        'as': 'ledgers'
      }
    },
    { '$unwind': '$ledgers' },
    { '$project': {
      'id': '$ledgers._id',
      'name': '$ledgers.name',
      'code': '$ledgers.code'
    }}

  ]

  @get(`${VOUCHER_API}/ledgers-used/{vType}`)
  @response(200, {
    description: 'List of ledgers used by voucher type',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ledger, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async ledgersUsed(@param.path.string('vType') vType: string,): Promise<Ledger[]> {

    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', this.createLedgersByVTypeAggr(vType));
    const toArr = await pQuery.toArray();
    return toArr;

  }

  @patch(VOUCHER_API)
  @response(200, {
    description: 'Voucher PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.voucherUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Voucher, {partial: true}),
        },
      },
    })
      voucher: Voucher,
    @param.where(Voucher) where?: Where<Voucher>,
  ): Promise<Count> {

    const countR = await this.voucherRepository.updateAll(voucher, where);
    return countR;

  }

  @get(`${VOUCHER_API}/{id}`)
  @response(200, {
    description: 'Voucher model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Voucher, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Voucher, {exclude: 'where'}) filter?: FilterExcludingWhere<Voucher>
  ): Promise<Voucher> {

    const voucherR = await this.voucherRepository.findById(id, filter);
    return voucherR;

  }

  @patch(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher PATCH success',
  })
  @authorize({resource: resourcePermissions.voucherUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Voucher, {partial: true}),
        },
      },
    })
      voucher: Voucher,
  ): Promise<void> {

    await this.voucherRepository.updateById(id, voucher);

  }

  @put(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher PUT success',
  })
  @authorize({resource: resourcePermissions.voucherUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() voucher: Voucher,
  ): Promise<void> {

    await this.voucherRepository.replaceById(id, voucher);

  }

  @del(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher DELETE success',
  })
  @authorize({resource: resourcePermissions.voucherDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.voucherRepository.deleteById(id);

  }

  @del(VOUCHER_API)
  @response(204, {
    description: 'Voucher DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.voucherDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Voucher) where?: Where<Voucher>,
  ): Promise<Count> {

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

  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<unknown>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: unknown) => {

        if (err) {

          reject(err);

        } else {

          resolve(VoucherController.getFilesAndFields(request));

        }

      });

    })

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

  private costCentreMap = async(costCentreRepository:CostCentreRepository, cCodes: Array<string>)
  :Promise<Record<string, CostCentre>> => {

    const ledgers = await costCentreRepository.find({where: {name: {inq: cCodes}}});
    const cCenterMap:Record<string, CostCentre> = {};
    ledgers.forEach((ldgr) => (cCenterMap[ldgr.name] = ldgr));
    const invalidLCodes = cCodes.filter((lcd) => !cCenterMap[lcd]);
    if (invalidLCodes && invalidLCodes.length) {

      throw new HttpErrors.UnprocessableEntity(`The following cost centres are invalid ${JSON.stringify(invalidLCodes)}`);

    }
    return cCenterMap;

  }

  private extractVoucherData = (vouchersData:Array<VoucherImport>)
  :[Array<string>, Array<string>] => {

    const lCodes:Array<string> = [];
    const ccCodes:Array<string> = [];
    vouchersData.forEach((vData) => {

      if (vData.PrimaryLedger && !lCodes.includes(vData.PrimaryLedger)) {

        lCodes.push(vData.PrimaryLedger);

      }

      if (vData.CompoundLedger && !lCodes.includes(vData.CompoundLedger)) {

        lCodes.push(vData.CompoundLedger);

      }

      if (vData.CostCentre && !ccCodes.includes(vData.CostCentre)) {

        ccCodes.push(vData.CostCentre);

      }

    });
    return [ lCodes, ccCodes ];

  }

  private findVoucherType = (vType: string):VoucherType => {

    switch (vType) {

    case 'Sales':
      return VoucherType.SALES;
    case 'Purchase':
      return VoucherType.PURCHASE;
    case 'Payment':
      return VoucherType.PAYMENT;
    case 'Receipt':
      return VoucherType.RECEIPT;
    case 'Contra':
      return VoucherType.CONTRA;
    case 'Journal':
      return VoucherType.JOURNAL;
    case 'Credit Note':
      return VoucherType.CREDIT_NOTE;
    case 'Debit Note':
      return VoucherType.CREDIT_NOTE;

    }
    throw new HttpErrors.UnprocessableEntity(`Invalid voucher type ${vType}`);

  }

  private createVoucher = async(vouchersData:Array<VoucherImport>, ledgerMap: Record<string, Ledger>,
    cCentreMap:Record<string, CostCentre>, uProfile: ProfileUser, finYearRepository : FinYearRepository)
    :Promise<void> => {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    if (!finYear) {

      throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

    }
    const {startDate, endDate} = finYear;
    
    const newVouchers:Array<{details: string,
      date: Date,
      type: VoucherType,
      number?: string,
      transactions: Array<Partial<Transaction>>}> = [];

    for (const [rowNum, vData] of vouchersData.entries()) {

      const details = vData.Details;
      const dayJsDate = dayjs.utc(vData.Date, 'DD-MM-YYYY');
      if(!dayJsDate.isValid()){

        throw new HttpErrors.UnprocessableEntity(`Please select a proper date for ${vData.Date}, ${vData.PrimaryLedger} at row ${rowNum + 1}.`);

      }
      const date = dayJsDate.toDate();
      if(date < startDate || date > endDate){

        throw new HttpErrors.UnprocessableEntity(`Please select a proper date for ${vData.Date}, ${vData.PrimaryLedger} at row ${rowNum + 1}.`);
        
      }
      
      const type = this.findVoucherType(vData.VoucherType);
      const pType = vData.Credit > 0 ? TransactionType.CREDIT : TransactionType.DEBIT;
      const cType = vData.Credit > 0 ? TransactionType.DEBIT : TransactionType.CREDIT;
      const amount = vData.Credit > 0 ? vData.Credit : vData.Debit;
      const pTransaction:Partial<Transaction> = {
        type: pType,
        order: 1,
        ledgerId: ledgerMap[vData.PrimaryLedger].id,
        amount,
        costCentreId: cCentreMap[vData.CostCentre]?.id ?? null
      };
      const cTransaction:Partial<Transaction> = {
        type: cType,
        order: 2,
        ledgerId: ledgerMap[vData.CompoundLedger].id,
        amount,
      };

      newVouchers.push({
        details,
        date,
        type,
        transactions: [ pTransaction, cTransaction ]
      })

    }

    newVouchers.forEach(async (voucher) => {
      
      const otherDetails = finYear.extras as {lastVNo:number};
      const lastVNo = otherDetails?.lastVNo ?? 0;
      const nextVNo = lastVNo + 1;
      const nextVNoS = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();
      voucher.number = nextVNoS;
      await this.voucherRepository.create(voucher);
      await finYearRepository.updateById(finYear.id, {extras: {lastVNo: nextVNo}});

    })

  }

  @post(`${VOUCHER_API}/import`, {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async importVouchers(
    @requestBody.file()
      request: Request,
    @inject(RestBindings.Http.RESPONSE) response2: Response,
    @inject(BindingKeys.FILE_UPLOAD_SERVICE) fileUploadHandler: FileUploadHandler,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
    @repository(FinYearRepository) finYearRepository : FinYearRepository,
    @repository(LedgerRepository) ledgerRepository : LedgerRepository,
    @repository(CostCentreRepository) costCentreRepository : CostCentreRepository,
  ): Promise<unknown> {

    await this.saveUploadedFile(fileUploadHandler, request, response2);
    const [ fileDetails ] = request.files as Array<{path: string}>;
    const savedFilePath = fileDetails.path;
    const workBook = xlsx.readFile(savedFilePath);
    const sheetNames = workBook.SheetNames;
    const vouchersData:Array<VoucherImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
    const [ lCodes, ccCodes ] = this.extractVoucherData(vouchersData);
    const ledgerMap = await this.findLedgerMap(ledgerRepository, lCodes);
    const cCentreMap = await this.costCentreMap(costCentreRepository, ccCodes);
    await this.createVoucher(vouchersData, ledgerMap, cCentreMap, uProfile, finYearRepository);
    return vouchersData;

  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields(request: Request) {

    const uploadedFiles = request.files;
    const mapper = (file2: globalThis.Express.Multer.File) => ({
      fieldname: file2.fieldname,
      originalname: file2.originalname,
      encoding: file2.encoding,
      mimetype: file2.mimetype,
      size: file2.size,
    });
    let files = [];
    if (Array.isArray(uploadedFiles)) {

      files = uploadedFiles.map(mapper);

    } else {

      for (const filename in uploadedFiles) {

        if (!uploadedFiles.hasOwnProperty(filename)) {

          continue;

        }

        files.push(...uploadedFiles[filename].map(mapper));

      }

    }
    return {files,
      fields: request.body};

  }

}
