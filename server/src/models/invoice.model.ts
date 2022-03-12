import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Invoice as InvoiceInft } from '@shared/entity/inventory/invoice';
import { Customer } from './customer.model';
import { SaleItem } from './sale-item.model';

@model()
export class Invoice extends Entity implements InvoiceInft {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  customer: Customer;

  @property({
    type: 'date',
    required: true
  })
  invoiceDate: Date;

  @property({
    type: 'date',
  })
  dueDate: Date;

  @property({
    type: 'string',
  })
  invoiceNumber: string;

  @property({
    type: 'number',
    required: true,
  })
  totalAmount: number;

  @property({
    type: 'number',
  })
  totalDiscount: number;

  @property({
    type: 'number',
  })
  totalTax: number;

  @property({
    type: 'number',
  })
  roundOff: number;

  @property({
    type: 'number',
    required: true,
  })
  grandTotal: number;

  @property({
    type: 'string',
  })
  notes: string;

  @property({
    type: 'boolean',
  })
  isReceived: boolean;

  @property.array(SaleItem)
  saleItems: SaleItem[];

  @belongsTo(() => Customer)
  customerId: string;

  constructor(data?: Partial<Invoice>) {

    super(data);

  }

}

export interface InvoiceRelations {
  // Describe navigational properties here
}

export type InvoiceWithRelations = Invoice & InvoiceRelations;
