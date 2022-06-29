import {injectable, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { VoucherRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class VoucherService {

  constructor(
    @repository(VoucherRepository)
    public voucherRepository : VoucherRepository,) {}

    private ledgerGroupSummaryAggregates = [
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

    private ledgerSummaryAggregates = [
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

  private createLedgerReportAggregates = (plid: string, clid?: string):Array<unknown> => [
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
      '$project': {
        'id': 1,
        'number': 1,
        'date': 1,
        'type': 1,
        'details': 1,
        'name': '$ledgers.name',
        'credit': {'$cond': [ {'$eq': [ '$tType', 'Debit' ]}, '$amount', 0 ]},
        'debit': {'$cond': [ {'$eq': [ '$tType', 'Credit' ]}, '$amount', 0 ]},
      }
    },
    {
      '$sort': { 'date': 1 }
    },
  ]

  private createLedgerGroupReportAggregates = (lids: Array<string>):Array<unknown> => [
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

  generateLedgerGroupSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...this.ledgerGroupSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<TrialBalanceItem>> await pQuery.toArray();
    return res;

  }

  generateLedgerSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...this.ledgerSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<TrialBalanceItem>> await pQuery.toArray();
    return res;

  }

  generateLedgerGroupReport = async(ason: Date, plids: string[]): Promise<LedgerReportItem[]> => {

    const ledgerReportAggs = this.createLedgerGroupReportAggregates(plids);
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

  generateLedgerReport = async(ason: Date, plid: string, clid?: string): Promise<LedgerReportItem[]> => {

    const ledgerReportAggs = this.createLedgerReportAggregates(plid, clid);
    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...ledgerReportAggs ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerReportItem>> await pQuery.toArray();
    return res;

  }

}
