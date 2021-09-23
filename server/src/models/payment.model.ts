import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Payment as PaymentInft} from '@shared/entity/inventory/payment';
import {Vendor} from './vendor.model';
import {Bank} from './bank.model';
import {Bill} from './bill.model';

@model()
export class Payment extends Entity implements PaymentInft {

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
  paidDate: Date;

  vendor: Vendor;

  bill: Bill;

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
  description?: string;

  @belongsTo(() => Vendor)
  vendorId: string;

  @belongsTo(() => Bank)
  bankId: string;

  @belongsTo(() => Bill)
  billId: string;

  constructor(data?: Partial<Payment>) {

    super(data);

  }

}

export interface PaymentRelations {
  // Describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
