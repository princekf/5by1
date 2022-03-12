import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Ledger, LedgerGroup} from '../models';
import {LedgerRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class LedgerLedgerGroupController {

  constructor(
    @repository(LedgerRepository)
    public ledgerRepository: LedgerRepository,
  ) { }

  @get('/ledgers/{id}/ledger-group', {
    responses: {
      '200': {
        description: 'LedgerGroup belonging to Ledger',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(LedgerGroup)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgerView.name,
    ...adminAndUserAuthDetails})
  async getLedgerGroup(
    @param.path.string('id') id: typeof Ledger.prototype.id,
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerRepository.ledgerGroup(id);
    return lgR;

  }

}
