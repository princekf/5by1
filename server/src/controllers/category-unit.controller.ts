import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Category,
  Unit,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryUnitController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/unit', {
    responses: {
      '200': {
        description: 'Unit belonging to Category',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  async getUnit(
    @param.path.string('id') id: typeof Category.prototype.id,
  ): Promise<Unit> {
    return this.categoryRepository.unit(id);
  }
}
