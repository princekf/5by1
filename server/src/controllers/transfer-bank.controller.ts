import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Transfer, Bank} from '../models';
import {TransferRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class TransferBankController {

  constructor(
    @repository(TransferRepository)
    public transferRepository: TransferRepository,
  ) { }

  @get('/transfers/{id}/bank', {
    responses: {
      '200': {
        description: 'Bank belonging to Transfer',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Bank)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.transferView.name,
    ...adminAndUserAuthDetails})
  async getBank(
    @param.path.string('id') id: typeof Transfer.prototype.id,
  ): Promise<Bank> {

    const bankR = await this.transferRepository.toAccount(id);
    return bankR;

  }

}
