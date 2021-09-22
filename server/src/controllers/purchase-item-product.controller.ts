import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PurchaseItem,
  Product,
} from '../models';
import {PurchaseItemRepository} from '../repositories';

export class PurchaseItemProductController {
  constructor(
    @repository(PurchaseItemRepository)
    public purchaseItemRepository: PurchaseItemRepository,
  ) { }

  @get('/purchase-items/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to PurchaseItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.string('id') id: typeof PurchaseItem.prototype.id,
  ): Promise<Product> {
    return this.purchaseItemRepository.product(id);
  }
}
