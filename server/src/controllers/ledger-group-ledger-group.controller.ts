import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {LedgerGroup} from '../models';
import {LedgerGroupRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class LedgerGroupLedgerGroupController {

  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository: LedgerGroupRepository,
  ) { }

  @get('/ledger-groups/{id}/ledger-group', {
    responses: {
      '200': {
        description: 'LedgerGroup belonging to LedgerGroup',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(LedgerGroup)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async getLedgerGroup(
    @param.path.string('id') id: typeof LedgerGroup.prototype.id,
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerGroupRepository.parent(id);
    return lgR;

  }

}
