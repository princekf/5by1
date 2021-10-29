import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Category} from '../models';
import {CategoryRepository, UnitRepository} from '../repositories';
import { CATEGORY_API } from '@shared/server-apis';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class CategoryController {

  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
    @repository(UnitRepository)
    public unitRepository : UnitRepository,
  ) {}

  @post(CATEGORY_API)
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  @authorize({resource: resourcePermissions.categoryCreate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryUpdate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryUpdate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryUpdate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.categoryDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.categoryRepository.deleteById(id);

  }


  @del(CATEGORY_API)
  @response(204, {
    description: 'Category DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.categoryDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Category ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Category ids are required');

    }

    const count = await this.categoryRepository.deleteAll(where);
    return count;

  }

}
