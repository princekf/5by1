import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Revenue, Bank} from '../models';
import {RevenueRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class RevenueBankController {

  constructor(
    @repository(RevenueRepository)
    public revenueRepository: RevenueRepository,
  ) { }

  @get('/revenues/{id}/bank', {
    responses: {
      '200': {
        description: 'Bank belonging to Revenue',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Bank)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.revenueView.name,
    ...adminAndUserAuthDetails})
  async getBank(
    @param.path.string('id') id: typeof Revenue.prototype.id,
  ): Promise<Bank> {

    const bankR = await this.revenueRepository.bank(id);
    return bankR;

  }

}
