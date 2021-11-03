import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Transaction as TransactionIntf, TransactionType } from '@shared/entity/accounting/transaction';
import { CostCentre } from './cost-centre.model';
import {Ledger} from './ledger.model';

@model()
export class Transaction extends Entity implements TransactionIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'number',
    required: true,
  })
  order: number;

  ledger?: Ledger;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'string',
    required: true,
  })
  type: TransactionType;

  @property({
    type: 'string',
  })
  details: string;

  costCentre: CostCentre;

  @belongsTo(() => Ledger)
  ledgerId: string;

  @belongsTo(() => CostCentre)
  costCentreId: string;

  constructor(data?: Partial<Transaction>) {

    super(data);

  }

}

export interface TransactionRelations {
  // Describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
