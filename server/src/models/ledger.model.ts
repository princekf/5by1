import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Ledger as LedgerIntf } from '@shared/entity/accounting/ledger';
import {LedgerGroup} from './ledger-group.model';

@model({settings: {strict: false}})
export class Ledger extends Entity implements LedgerIntf {

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

  @property({
    type: 'string',
  })
  refNo: string;

  ledgerGroup: LedgerGroup;

  @belongsTo(() => LedgerGroup)
  ledgerGroupId: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Ledger>) {

    super(data);

  }

}

export interface LedgerRelations {
  // Describe navigational properties here
}

export type LedgerWithRelations = Ledger & LedgerRelations;
