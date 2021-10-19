import {Entity, model, property, belongsTo} from '@loopback/repository';
import { SaleItem as SaleItemInft } from '@shared/entity/inventory/invoice';
import { Product, Tax, Unit } from '.';

@model()
export class SaleItem extends Entity implements SaleItemInft {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  product: Product;

  @property({
    type: 'number',
    required: true
  })
  unitPrice: number;

  unit: Unit;

  @property({
    type: 'number',
    required: true
  })
  quantity: number;

  @property({
    type: 'number',
  })
  discount: number;

  @property.array(Tax)
  taxes: Array<Tax>

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
    type: 'number',
  })
  mrp: number;

  @property({
    type: 'date',
  })
  mfgDate: Date;

  @property({
    type: 'date',
  })
  expiryDate: Date;

  @property({
    type: 'number',
  })
  rrp: number;

  @belongsTo(() => Product)
  productId: string;

  @belongsTo(() => Unit)
  unitId: string;

  constructor(data?: Partial<SaleItem>) {

    super(data);

  }

}

export interface SaleItemRelations {
  // Describe navigational properties here
}

export type SaleItemWithRelations = SaleItem & SaleItemRelations;
