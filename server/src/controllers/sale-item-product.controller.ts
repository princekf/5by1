import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {SaleItem, Product} from '../models';
import {SaleItemRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
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
            schema: {type: 'array',
              items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.saleView.name,
    ...adminAndUserAuthDetails})
  async getProduct(
    @param.path.string('id') id: typeof SaleItem.prototype.id,
  ): Promise<Product> {

    const productR = await this.saleItemRepository.product(id);
    return productR;

  }

}
