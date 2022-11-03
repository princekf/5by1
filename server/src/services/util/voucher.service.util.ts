import { FileUploadHandler } from '../../types';
import { HttpErrors, Request, Response } from '@loopback/rest';
import { VoucherType } from '@shared/entity/accounting/voucher';
export class VoucherServiceUtil {

    static ledgerGroupSummaryAggregates = [
      {
        '$project': {
          'transactions': 1
        }
      },
      { '$unwind': '$transactions' },
      {
        '$project': {
          'ledgerId': '$transactions.ledgerId',
          'type': '$transactions.type',
          'credit': {'$cond': [ {'$eq': [ '$transactions.type', 'Credit' ]}, '$transactions.amount', 0 ]},
          'debit': {'$cond': [ {'$eq': [ '$transactions.type', 'Debit' ]}, '$transactions.amount', 0 ]},
        }
      },
      {
        '$lookup': {
          'from': 'Ledger',
          'localField': 'ledgerId',
          'foreignField': '_id',
          'as': 'ledgers'
        }
      },
      { '$unwind': '$ledgers' },
      {
        '$project': {
          'ledgerGroupId': '$ledgers.ledgerGroupId',
          'credit': 1,
          'debit': 1,
          'obCredit': {'$cond': [ {'$eq': [ '$ledgers.obType', 'Credit' ]}, '$ledgers.obAmount', 0 ]},
          'obDebit': {'$cond': [ {'$eq': [ '$ledgers.obType', 'Debit' ]}, '$ledgers.obAmount', 0 ]},
        }
      },
      {
        '$group': {
          '_id': '$ledgerGroupId',
          'id': {'$first': '$ledgerGroupId'},
          'credit': {'$sum': '$credit'},
          'debit': {'$sum': '$debit'},
          'obCredit': {'$sum': '$obCredit'},
          'obDebit': {'$sum': '$obDebit'},
        }
      },
      {
        '$lookup': {
          'from': 'LedgerGroup',
          'localField': 'id',
          'foreignField': '_id',
          'as': 'ledgerGroup'
        }
      },
      { '$unwind': '$ledgerGroup' },
      {
        '$project': {
          'id': 1,
          'credit': 1,
          'debit': 1,
          'obCredit': 1,
          'obDebit': 1,
          'name': '$ledgerGroup.name',
          'code': '$ledgerGroup.code',
        }
      },
      {
        '$sort': { 'name': 1 }
      },
    ];

    static ledgerSummaryAggregates = [
      {
        '$project': {
          'transactions': 1
        }
      },
      { '$unwind': '$transactions' },
      {
        '$project': {
          'ledgerId': '$transactions.ledgerId',
          'type': '$transactions.type',
          'credit': {'$cond': [ {'$eq': [ '$transactions.type', 'Credit' ]}, '$transactions.amount', 0 ]},
          'debit': {'$cond': [ {'$eq': [ '$transactions.type', 'Debit' ]}, '$transactions.amount', 0 ]},
        }
      },
      {
        '$lookup': {
          'from': 'Ledger',
          'localField': 'ledgerId',
          'foreignField': '_id',
          'as': 'ledgers'
        }
      },
      { '$unwind': '$ledgers' },
      {
        '$group': {
          '_id': '$ledgers._id',
          'name': {'$first': '$ledgers.name'},
          'lgid': {'$first': '$ledgers.ledgerGroupId'},
          'code': {'$first': '$ledgers.code'},
          'credit': {'$sum': '$credit'},
          'debit': {'$sum': '$debit'},
          'obAmount': {'$first': '$ledgers.obAmount'},
          'obType': {'$first': '$ledgers.obType'},
        }
      },
      {
        '$project': {
          'id': '$_id',
          'parentId': '$lgid',
          'name': '$name',
          'code': '$code',
          'credit': '$credit',
          'debit': '$debit',
          'type': '$transactions.type',
          'obCredit': {'$cond': [ {'$eq': [ '$obType', 'Credit' ]}, '$obAmount', 0 ]},
          'obDebit': {'$cond': [ {'$eq': [ '$obType', 'Debit' ]}, '$obAmount', 0 ]},
        }
      },
      { '$sort': { 'name': 1 } }
    ];

      static dayBookAggregates = [
        { '$sort': { 'date': 1 } },
        {
          '$unwind': '$transactions'
        },
        {
          '$project': {
            'ledgerId': '$transactions.ledgerId',
            'date': '$date',
            'type': '$type',
            'number': '$number',
            'credit': {'$cond': [ {'$eq': [ '$transactions.type', 'Credit' ]}, '$transactions.amount', 0 ]},
            'debit': {'$cond': [ {'$eq': [ '$transactions.type', 'Debit' ]}, '$transactions.amount', 0 ]},
          }
        },

        {
          '$lookup': {
            'from': 'Ledger',
            'localField': 'ledgerId',
            'foreignField': '_id',
            'as': 'ledgers'
          }
        },

        { '$unwind': '$ledgers' },
        {
          '$project': {
            'voucherId': '$_id',
            'ledgerId': '$ledgerId',
            'ledgerName': '$ledgers.name',
            'ledgerCode': '$ledgers.code',
            'date': '$date',
            'type': '$type',
            'number': '$number',
            'credit': '$credit',
            'debit': '$debit',
          }
        },
      ];

    static ledgerReportAggrsProject = ():Array<unknown> => [
      {
        '$project': {
          'id': 1,
          'number': 1,
          'date': 1,
          'type': 1,
          'details': { '$concat': [ '$details', ' - ', {'$ifNull': [ '$tdetails', '' ]}, ' - ', { '$ifNull': [ '$pdetails', '' ] }, ] },
          'name': '$ledgers.name',
          'credit': {'$cond': [ {'$eq': [ '$tType', 'Debit' ]}, '$amount', 0 ]},
          'debit': {'$cond': [ {'$eq': [ '$tType', 'Credit' ]}, '$amount', 0 ]},
          'documents': 1,
        }
      },
      {
        '$sort': { 'date': 1 }
      },
    ]

    static createLedgerReportAggregates = (plid: string, clid?: string):Array<unknown> => [
      { '$match': {'$or': [ { 'transactions.ledgerId': plid }, { 'transactions.ledgerId': clid ?? '' } ]}},
      { '$addFields': { 'primaryTransaction': { '$first': '$transactions' } } },
      { '$unwind': '$transactions' },
      { '$match': { '$and': [ {'transactions.order': {'$gt': 1} }, { '$or': [ {'transactions.ledgerId': plid}, {'primaryTransaction.ledgerId': plid} ] } ]}},
      { '$match': { '$or': clid ? [ {'transactions.ledgerId': clid}, {'primaryTransaction.ledgerId': clid} ] : [ {} ]}},
      {
        '$project': {
          'id': '$_id',
          'number': 1,
          'date': 1,
          'type': '$type',
          'details': 1,
          'tdetails': '$transactions.details',
          'pdetails': '$primaryTransaction.details',
          'cLedgerId': {'$cond': [ {'$eq': [ '$transactions.ledgerId', plid ]}, '$primaryTransaction.ledgerId', '$transactions.ledgerId' ]},
          'tType': {'$cond': [ {'$eq': [ '$transactions.ledgerId', plid ]}, '$primaryTransaction.type', '$transactions.type' ]},
          'amount': {'$cond': [ {'$lt': [ '$transactions.amount', '$primaryTransaction.amount' ]}, '$transactions.amount', '$primaryTransaction.amount' ]},
        }
      },
      {
        '$lookup': {
          'from': 'Ledger',
          'localField': 'cLedgerId',
          'foreignField': '_id',
          'as': 'ledgers'
        }
      },
      { '$unwind': '$ledgers' },
      {
        '$lookup': {
          'from': 'VoucherDocument',
          'localField': '_id',
          'foreignField': 'voucherId',
          'as': 'documents'
        }
      },
      ...VoucherServiceUtil.ledgerReportAggrsProject()
    ]

    static createLedgerGroupReportAggregates = (lids: Array<string>):Array<unknown> => [
      { '$match': {'$or': [ { 'transactions.ledgerId': {'$in': lids} } ]}},
      { '$addFields': { 'primaryTransaction': { '$first': '$transactions' } } },
      { '$unwind': '$transactions' },
      { '$match': {'transactions.order': {'$gt': 1} }},
      {
        '$project': {
          'id': '$_id',
          'number': 1,
          'date': 1,
          'type': 1,
          'details': 1,
          'pLedgerId': {'$cond': [ {'$in': [ '$transactions.ledgerId', lids ]}, '$transactions.ledgerId', '$primaryTransaction.ledgerId' ]},
          'cLedgerId': {'$cond': [ {'$in': [ '$transactions.ledgerId', lids ]}, '$primaryTransaction.ledgerId', '$transactions.ledgerId' ]},
          'tType': {'$cond': [ {'$in': [ '$transactions.ledgerId', lids ]}, '$primaryTransaction.type', '$transactions.type' ]},
          'amount': {'$cond': [ {'$lt': [ '$transactions.amount', '$primaryTransaction.amount' ]}, '$transactions.amount', '$primaryTransaction.amount' ]},
        }
      },
      {
        '$lookup': {
          'from': 'Ledger',
          'localField': 'cLedgerId',
          'foreignField': '_id',
          'as': 'ledgers'
        }
      },
      { '$unwind': '$ledgers' },
      {
        '$lookup': {
          'from': 'Ledger',
          'localField': 'pLedgerId',
          'foreignField': '_id',
          'as': 'pledgers'
        }
      },
      { '$unwind': '$pledgers' },
    ];

  static createLedgersByVTypeAggr = (vType: string): unknown => [
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

  ];


  /**
   * Get files and fields for the request
   * @param request - Http request
   */
   static getFilesAndFields = (request: Request): unknown => {

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


static saveUploadedFile = (fileHandler: FileUploadHandler, request: Request, response2: Response): Promise<unknown> =>
  new Promise<unknown>((resolve, reject) => {

    fileHandler(request, response2, (err: unknown) => {

      if (err) {

        reject(err);

      } else {

        resolve(VoucherServiceUtil.getFilesAndFields(request));

      }

    });

  })


  static findVoucherType = (vType: string):VoucherType => {

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


}
