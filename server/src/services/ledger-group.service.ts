import {injectable, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { LedgerGroup } from '../models';
import { LedgerGroupRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class LedgerGroupService {

  constructor(@repository(LedgerGroupRepository)
  public ledgerGroupRepository : LedgerGroupRepository,) {}

  private lgWithParentsAggregate = [
    {
      '$graphLookup': {
        'from': 'LedgerGroup',
        'startWith': '$parentId',
        'connectFromField': 'parentId',
        'connectToField': '_id',
        'as': 'parents'
      }
    },
    {
      '$project': {
        'id': '$_id',
        'name': '$name',
        'code': '$code',
        'parentId': '$parentId',
        'details': '$details',
        'parents': '$parents'
      }
    },
  ]

  findLedgerGroupsWithParents =
  async(ldIds: Array<string>):Promise<Array<LedgerGroup & {parents: Array<LedgerGroup>}>> => {

    const aggregates = [ { '$match': { '_id': { '$in': ldIds } } }, ...this.lgWithParentsAggregate ];
    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerGroup & {parents: Array<LedgerGroup>}>> await pQuery.toArray();
    return res;

  }

}
