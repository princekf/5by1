import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Category, Unit} from '../models';
import {CategoryRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
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
            schema: {type: 'array',
              items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
  async getUnit(
    @param.path.string('id') id: typeof Category.prototype.id,
  ): Promise<Unit> {

    const unitR = await this.categoryRepository.unit(id);
    return unitR;

  }

}
