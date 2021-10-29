import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Unit} from '../models';
import {UnitRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class UnitUnitController {

  constructor(
    @repository(UnitRepository)
    public unitRepository: UnitRepository,
  ) { }

  @get('/units/{id}/unit', {
    responses: {
      '200': {
        description: 'Unit belonging to Unit',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.unitView.name,
    ...adminAndUserAuthDetails})
  async getUnit(
    @param.path.string('id') id: typeof Unit.prototype.id,
  ): Promise<Unit> {

    const unitRet = await this.unitRepository.parent(id);
    return unitRet;

  }

}
