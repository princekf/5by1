import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Product} from '../models';
import {ProductRepository} from '../repositories';
import { PRODUCT_API } from '@shared/server-apis';
import { ArrayReponse } from '../models/util/array-resp.model';
import { ArrayResponse as ArrayReponseInft } from '@shared/util/array-resp';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class ProductController {

  constructor(
    @repository(ProductRepository)
    public productRepository : ProductRepository,
  ) {}

  @post(PRODUCT_API)
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  @authorize({resource: resourcePermissions.productCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      product: Omit<Product, 'id'>,
  ): Promise<Product> {

    const productR = await this.productRepository.create(product);
    return productR;

  }

  @get(`${PRODUCT_API}/distinct/{column}`)
  @response(200, {
    description: 'Tax model group names',
    content: {'application/json': {schema: ArrayReponse}},
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async distinct(
    @param.path.string('column') column: string,
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<ArrayReponseInft> {

    const resp = await this.productRepository.distinct(column, filter);
    return resp;

  }

  @get(`${PRODUCT_API}/count`)
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {

    const count = await this.productRepository.count(where);
    return count;

  }

  @get(PRODUCT_API)
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {

    const products = await this.productRepository.find(filter);
    return products;

  }

  @patch(PRODUCT_API)
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.productUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {

    const count = await this.productRepository.updateAll(product, where);
    return count;

  }

  @get(`${PRODUCT_API}/{id}`)
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'}) filter?: FilterExcludingWhere<Product>
  ): Promise<Product> {

    const productR = await this.productRepository.findById(id, filter);
    return productR;

  }

  @patch(`${PRODUCT_API}/{id}`)
  @response(204, {
    description: 'Product PATCH success',
  })
  @authorize({resource: resourcePermissions.productUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
  ): Promise<void> {

    await this.productRepository.updateById(id, product);

  }

  @put(`${PRODUCT_API}/{id}`)
  @response(204, {
    description: 'Product PUT success',
  })
  @authorize({resource: resourcePermissions.productUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {

    await this.productRepository.replaceById(id, product);

  }

  @del(`${PRODUCT_API}/{id}`)
  @response(204, {
    description: 'Product DELETE success',
  })
  @authorize({resource: resourcePermissions.productDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.productRepository.deleteById(id);

  }

  @del(PRODUCT_API)
  @response(204, {
    description: 'Products DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.productDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Product ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Product ids are required');

    }

    const count = await this.productRepository.deleteAll(where);
    return count;

  }

}
