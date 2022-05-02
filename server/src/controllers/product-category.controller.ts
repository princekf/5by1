import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Product, Category} from '../models';
import {ProductRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class ProductCategoryController {

  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async getCategory(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Category> {

    const categoryR = await this.productRepository.category(id);
    return categoryR;

  }

}
