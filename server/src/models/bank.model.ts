import { Entity, model, property } from '@loopback/repository';
import { Bank as BankIntf } from '@shared/entity/inventory/bank';

@model()
export class Bank extends Entity implements BankIntf {

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
  type: 'Bank' | 'Cash' | 'Other';

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'number',
  })
  openingBalance: number;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<Bank>) {

    super(data);

  }

}

export interface BankRelations {
  // Describe navigational properties here
}

export type BankWithRelations = Bank & BankRelations;
