import {injectable, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { LedgerSummaryTB } from '@shared/util/trial-balance-ledger-summary';
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
          'debit': {'$cond': [ {'$eq': [ '$transactions.type', 'Debit' ]}, '$transactions.amount', 0 ]}
        }
      },
      {
        '$group': {
          '_id': '$ledgerId',
          'credit': {'$sum': '$credit'},
          'debit': {'$sum': '$debit'}
        }
      },
      {
        '$lookup': {
          'from': 'Ledger',
          'localField': '_id',
          'foreignField': '_id',
          'as': 'ledgers'
        }
      },
      { '$unwind': '$ledgers' },
      {
        '$project': {
          'id': '$_id',
          'credit': '$credit',
          'debit': '$debit',
          'name': '$ledgers.name',
          'code': '$ledgers.code',
          'obAmount': '$ledgers.obAmount',
          'obType': '$ledgers.obType',
          'ledgerGroupId': '$ledgers.ledgerGroupId',
        }
      },
    ];


  generateLedgerSummary = async(ason: Date):Promise<Array<LedgerSummaryTB>> => {

    const aggregates = [ { '$match': { 'date': { '$lte': ason } } }, ...this.ledgerSummaryAggregates ];
    const pQuery = await this.voucherRepository.execute(this.voucherRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerSummaryTB>> await pQuery.toArray();
    return res;

  }

}
