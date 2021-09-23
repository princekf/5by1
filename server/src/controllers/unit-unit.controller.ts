import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Unit,
} from '../models';
import {UnitRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
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
  async getUnit(
    @param.path.string('id') id: typeof Unit.prototype.id,
  ): Promise<Unit> {

    const unitRet = await this.unitRepository.parent(id);
    return unitRet;

  }

}
