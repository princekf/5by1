import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, } from '@loopback/rest';
import {Product} from '../models';
import {ProductRepository} from '../repositories';
import { PRODUCT_API } from '@shared/server-apis';

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

  @get(`${PRODUCT_API}/count`)
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
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
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.productRepository.deleteById(id);

  }

}
