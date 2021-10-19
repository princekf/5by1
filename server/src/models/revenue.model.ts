import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Revenue as RevenueInft} from '@shared/entity/inventory/revenue';
import {Customer} from './customer.model';
import {Bank} from './bank.model';
import {Invoice} from './invoice.model';

@model()
export class Revenue extends Entity implements RevenueInft {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'date',
    required: true
  })
  receivedDate: Date;

  customer: Customer;

  invoice: Invoice;

  bank: Bank;

  @property({
    type: 'string',
  })
  category: string;

  @property({
    type: 'number',
    required: true
  })
  amount: number;

  @property({
    type: 'string',
  })
  description: string;

  @belongsTo(() => Customer)
  customerId: string;

  @belongsTo(() => Invoice)
  invoiceId: string;

  @belongsTo(() => Bank)
  bankId: string;

  constructor(data?: Partial<Revenue>) {

    super(data);

  }


}

export interface RevenueRelations {
  // Describe navigational properties here
}

export type RevenueWithRelations = Revenue & RevenueRelations;
