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
        'credit': {'$cond': [ {'$eq': [ '$tType', 'Credit' ]}, '$amount', 0 ]},
        'debit': {'$cond': [ {'$eq': [ '$tType', 'Debit' ]}, '$amount', 0 ]},
      }
    },
    {
      '$sort': { 'date': 1 }
    },
  ]

  generateLedgerSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...this.ledgerSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<TrialBalanceItem>> await pQuery.toArray();
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
