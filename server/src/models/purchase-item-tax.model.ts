import {Entity, model, belongsTo, property} from '@loopback/repository';
import {PurchaseItem} from './purchase-item.model';
import {Tax} from './tax.model';

@model()
export class PurchaseItemTax extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @belongsTo(() => PurchaseItem)
  purchaseItemId: string;

  @belongsTo(() => Tax)
  taxId: string;

  constructor(data?: Partial<PurchaseItemTax>) {

    super(data);

  }

}

export interface PurchaseItemTaxRelations {
  // Describe navigational properties here
}

export type PurchaseItemTaxWithRelations = PurchaseItemTax & PurchaseItemTaxRelations;
