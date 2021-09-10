import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, } from '@loopback/rest';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import { CATEGORY_API } from '@shared/server-apis';

export class CategoryController {

  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
  ) {}

  @post(CATEGORY_API)
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      category: Omit<Category, 'id'>,
  ): Promise<Category> {

    const categoryR = await this.categoryRepository.create(category);
    return categoryR;

  }

  @get(`${CATEGORY_API}/count`)
  @response(200, {
    description: 'Category model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {

    const count = await this.categoryRepository.count(where);
    return count;

  }

  @get(CATEGORY_API)
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {

    const categories = await this.categoryRepository.find(filter);
    return categories;

  }

  @patch(CATEGORY_API)
  @response(200, {
    description: 'Category PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
      category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {

    const count = await this.categoryRepository.updateAll(category, where);
    return count;

  }

  @get(`${CATEGORY_API}/{id}`)
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {

    const categoryR = await this.categoryRepository.findById(id, filter);
    return categoryR;

  }

  @patch(`${CATEGORY_API}/{id}`)
  @response(204, {
    description: 'Category PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
      category: Category,
  ): Promise<void> {

    await this.categoryRepository.updateById(id, category);

  }

  @put(`${CATEGORY_API}/{id}`)
  @response(204, {
    description: 'Category PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() category: Category,
  ): Promise<void> {

    await this.categoryRepository.replaceById(id, category);

  }

  @del(`${CATEGORY_API}/{id}`)
  @response(204, {
    description: 'Category DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.categoryRepository.deleteById(id);

  }

}
