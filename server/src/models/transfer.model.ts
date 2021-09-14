import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Transfer as TransferIntf } from '@shared/entity/inventory/transfer';
import { Bank } from './bank.model';

@model()
export class Transfer extends Entity implements TransferIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  fromAccount: Bank;

  toAccount: Bank;

  @property({
    type: 'date',
    required: true
  })
  transferDate: Date;

  @property({
    type: 'number',
    required: true
  })
  amount: number;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Bank)
  fromAccountId: string;

  @belongsTo(() => Bank)
  toAccountId: string;

  constructor(data?: Partial<Transfer>) {

    super(data);

  }

}

export interface TransferRelations {
  // Describe navigational properties here
}

export type TransferWithRelations = Transfer & TransferRelations;
