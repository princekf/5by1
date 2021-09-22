import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PurchaseItemTax,
  PurchaseItem,
} from '../models';
import {PurchaseItemTaxRepository} from '../repositories';

export class PurchaseItemTaxPurchaseItemController {
  constructor(
    @repository(PurchaseItemTaxRepository)
    public purchaseItemTaxRepository: PurchaseItemTaxRepository,
  ) { }

  @get('/purchase-item-taxes/{id}/purchase-item', {
    responses: {
      '200': {
        description: 'PurchaseItem belonging to PurchaseItemTax',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PurchaseItem)},
          },
        },
      },
    },
  })
  async getPurchaseItem(
    @param.path.string('id') id: typeof PurchaseItemTax.prototype.id,
  ): Promise<PurchaseItem> {
    return this.purchaseItemTaxRepository.purchaseItem(id);
  }
}
