import {injectable, BindingScope} from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { LedgerGroup } from '../models';
import { LedgerGroupRepository } from '../repositories';
import { LedgerGroup as LedgerGroupIntf } from '@shared/entity/accounting/ledger-group';

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

  private lgWithChildrenAggregate = [
    {
      '$graphLookup': {
        'from': 'LedgerGroup',
        'startWith': '$_id',
        'connectFromField': '_id',
        'connectToField': 'parentId',
        'maxDepth': 0,
        'as': 'children'
      }
    },
    {
      '$unwind': {
        'path': '$children',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$project': {
        '_id': 1,
        'id': '$_id',
        'name': 1,
        'code': 1,
        'parentId': 1,
        'children.id': '$children._id',
        'children.name': 1,
        'children.code': 1,
        'children.parentId': 1,
      }
    },
    {
      '$group': {
        '_id': '$_id',
        'parentId': {
          '$first': '$parentId'
        },
        'id': {
          '$first': '$id'
        },
        'name': {
          '$first': '$name'
        },
        'code': {
          '$first': '$code'
        },
        'children': {
          '$push': '$children'
        }
      }
    },
    { '$sort': { 'id': 1 } }
  ];

  private fillLDGParentMap = (ldGMap:Record<string, Array<LedgerGroupIntf>>, groups:Array<LedgerGroupIntf>) => {

    groups?.forEach((group) => {

      if (group.parentId) {

        ldGMap[group.parentId] = ldGMap[group.parentId] ?? [];
        ldGMap[group.parentId].push(group);
        this.fillLDGParentMap(ldGMap, group.children ?? []);

      }

    });

  }

  private fillWithChildren = (child: LedgerGroupIntf, ldGParentMap: Record<string, Array<LedgerGroupIntf>>) => {

    if (child.id && ldGParentMap[child.id]) {

      child.children = ldGParentMap[child.id];
      child.children.forEach((chl) => this.fillWithChildren(chl, ldGParentMap));

    }

  }

  findLedgerGroupsWithParents =
  async(ldIds: Array<string>):Promise<Array<LedgerGroup>> => {

    const aggregates = [ { '$match': { '_id': { '$in': ldIds } } }, ...this.lgWithParentsAggregate ];
    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerGroup>> await pQuery.toArray();
    return res;

  }

  findLedgerGroupsWithChildren = async():Promise<Array<LedgerGroupIntf>> => {

    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', this.lgWithChildrenAggregate);
    const groupsWithChilds = <Array<LedgerGroupIntf>> await pQuery.toArray();
    const ldGParentMap:Record<string, Array<LedgerGroupIntf>> = {};
    this.fillLDGParentMap(ldGParentMap, groupsWithChilds);
    const rootLGs = groupsWithChilds.filter((grp) => !grp.parentId);
    rootLGs.forEach((root) => {

      root.children?.forEach((child) => {

        this.fillWithChildren(child, ldGParentMap);


      });

    });
    return rootLGs;

  }

  find = async(filter?: Filter<LedgerGroup>):Promise<LedgerGroup[]> => {

    const resp = await this.ledgerGroupRepository.find(filter);
    return resp;

  }

}
