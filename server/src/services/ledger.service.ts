import {injectable, BindingScope} from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { Ledger } from '../models';
import { LedgerRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class LedgerService {

  constructor(@repository(LedgerRepository)
  public ledgerRepository : LedgerRepository,) {}

  private findLedgerIdsByGroupAggs = (lid: string) => [
    {
      '$graphLookup': {
        'from': 'LedgerGroup',
        'startWith': '$ledgerGroupId',
        'connectFromField': 'parentId',
        'connectToField': '_id',
        'as': 'parents'
      }
    },
    { '$unwind': '$parents' },
    { '$match': { 'parents._id': { '$eq': lid } } },
    {
      '$group': {
        '_id': '',
        'lids': {'$push': '$_id'}
      }
    }
  ]

  findLedgerIdsOfGroup = async(plid: string): Promise<{lids: string[]}> => {

    const ledgerReportAggs = this.findLedgerIdsByGroupAggs(plid);
    const pQuery = await this.ledgerRepository.execute(this.ledgerRepository.modelClass.name, 'aggregate', ledgerReportAggs);
    const res = <[{lids: string[]}]> await pQuery.toArray();
    return res[0] ?? null;

  }

  find = async(filter?: Filter<Ledger>): Promise<Ledger[]> => {

    const lgsR = await this.ledgerRepository.find(filter);
    return lgsR;

  }

  findById = async(id: string, filter?: Filter<Ledger>): Promise<Ledger> => {

    const lgsR = await this.ledgerRepository.findById(id, filter);
    return lgsR;

  }

}
