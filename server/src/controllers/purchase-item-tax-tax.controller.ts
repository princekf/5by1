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
  Tax,
} from '../models';
import {PurchaseItemTaxRepository} from '../repositories';

export class PurchaseItemTaxTaxController {
  constructor(
    @repository(PurchaseItemTaxRepository)
    public purchaseItemTaxRepository: PurchaseItemTaxRepository,
  ) { }

  @get('/purchase-item-taxes/{id}/tax', {
    responses: {
      '200': {
        description: 'Tax belonging to PurchaseItemTax',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tax)},
          },
        },
      },
    },
  })
  async getTax(
    @param.path.string('id') id: typeof PurchaseItemTax.prototype.id,
  ): Promise<Tax> {
    return this.purchaseItemTaxRepository.tax(id);
  }
}
