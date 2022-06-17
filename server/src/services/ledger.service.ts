import {injectable, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { LedgerRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class LedgerService {

  constructor(@repository(LedgerRepository)
  public ledgerRepository : LedgerRepository,) {}

  private createLedgerIdsByGroupAggs = (lid: string) => [
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
        '_id': '$ledgerGroupId',
        'lids': {'$push': '$_id'}
      }
    }
  ]

  findLedgerIdsOfGroup = async(plid: string): Promise<{lids: string[]}> => {

    const ledgerReportAggs = this.createLedgerIdsByGroupAggs(plid);
    const pQuery = await this.ledgerRepository.execute(this.ledgerRepository.modelClass.name, 'aggregate', ledgerReportAggs);
    const res = <[{lids: string[]}]> await pQuery.toArray();
    return res[0] ?? null;

  }

}
