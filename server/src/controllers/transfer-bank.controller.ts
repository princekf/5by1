import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Transfer,
  Bank,
} from '../models';
import {TransferRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
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
  async getBank(
    @param.path.string('id') id: typeof Transfer.prototype.id,
  ): Promise<Bank> {

    const bankR = await this.transferRepository.toAccount(id);
    return bankR;

  }

}
