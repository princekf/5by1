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
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
  })
  details: string;

  @property({
    type: 'number',
    required: true,
  })
  obAmount: number;

  @property({
    type: 'string',
    required: true,
  })
  obType: 'Credit' | 'Debit';

  ledgerGroup: LedgerGroup;

  @belongsTo(() => LedgerGroup)
  ledgerGroupId: string;

  // Indexer property to allow additional data
  [prop: string]: unknown;

  constructor(data?: Partial<Ledger>) {

    super(data);

  }

}

export interface LedgerRelations {
  // Describe navigational properties here
}

export type LedgerWithRelations = Ledger & LedgerRelations;
