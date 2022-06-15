import {injectable, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
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
    ];


  generateLedgerSummary = async(ason: Date):Promise<Array<TrialBalanceItem>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...this.ledgerSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<TrialBalanceItem>> await pQuery.toArray();
    return res;

  }

}
