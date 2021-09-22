import { Entity, model, property, belongsTo, hasMany } from '@loopback/repository';
import { Bill as BillInft } from '@shared/entity/inventory/bill';
import { PurchaseItem } from './purchase-item.model';
import { Vendor } from './vendor.model';

@model()
export class Bill extends Entity implements BillInft {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  vendor: Vendor;

  @property({
    type: 'date',
    required: true
  })
  billDate: Date;

  @property({
    type: 'date',
    required: false
  })
  dueDate: Date;

  @property({
    type: 'string',
  })
  billNumber: string;

  @property({
    type: 'string',
  })
  orderNumber: string;

  @property({
    type: 'date',
  })
  orderDate: Date;

  @property({
    type: 'number',
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
  })
  grandTotal: number;

  @property({
    type: 'string',
  })
  notes: string;

  @property({
    type: 'boolean',
  })
  isPaid: boolean;

  @belongsTo(() => Vendor)
  vendorId: string;

  @property.array(PurchaseItem)
  purchaseItems: PurchaseItem[];

  constructor(data?: Partial<Bill>) {

    super(data);

  }

}

export interface BillRelations {
  // Describe navigational properties here
}

export type BillWithRelations = Bill & BillRelations;
