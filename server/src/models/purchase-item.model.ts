import { Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import { PurchaseItem as PurchaseItemIntf } from '@shared/entity/inventory/bill';
import { Unit } from './unit.model';
import { Product } from './product.model';
import { Tax } from './tax.model';
import {PurchaseItemTax} from './purchase-item-tax.model';

@model()
export class PurchaseItem extends Entity implements PurchaseItemIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  product: Product;

  @belongsTo(() => Product)
  productId: string;

  @property({
    type: 'number',
    required: true
  })
  unitPrice: number;

  unit: Unit;

  @belongsTo(() => Unit)
  unitId: string;

  @property({
    type: 'number',
    required: true
  })
  quantity: number;

  @property({
    type: 'number',
  })
  discount: number;

  @property({
    type: 'number',
  })
  totalTax: number;

  @property({
    type: 'number',
    required: true
  })
  totalAmount: number;

  @property({
    type: 'string',
  })
  batchNumber: string;

  @property({
    type: 'date',
  })
  expiryDate: Date;

  @property({
    type: 'date',
  })
  mfgDate: Date;

  @property({
    type: 'number',
    required: true
  })
  mrp: number;

  @property({
    type: 'number',
    required: true
  })
  rrp: number;

  @property.array(Tax)
  taxes: Tax[];

  constructor(data?: Partial<PurchaseItem>) {

    super(data);

  }

}

export interface PurchaseItemRelations {
  // Describe navigational properties here
}

export type PurchaseItemWithRelations = PurchaseItem & PurchaseItemRelations;
