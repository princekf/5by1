import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SaleItem,
  Product,
} from '../models';
import {SaleItemRepository} from '../repositories';

export class SaleItemProductController {
  constructor(
    @repository(SaleItemRepository)
    public saleItemRepository: SaleItemRepository,
  ) { }

  @get('/sale-items/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to SaleItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.string('id') id: typeof SaleItem.prototype.id,
  ): Promise<Product> {
    return this.saleItemRepository.product(id);
  }
}
