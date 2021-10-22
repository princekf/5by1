import {Entity, model, property, belongsTo} from '@loopback/repository';
import { LedgerGroup as LedgerGroupIntf } from '@shared/entity/accounting/ledger-group';

@model({settings: {strict: false}})
export class LedgerGroup extends Entity implements LedgerGroupIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  details: string;

  parent: LedgerGroup;

  @belongsTo(() => LedgerGroup)
  parentId: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LedgerGroup>) {

    super(data);

  }

}

export interface LedgerGroupRelations {
  // Describe navigational properties here
}

export type LedgerGroupWithRelations = LedgerGroup & LedgerGroupRelations;
