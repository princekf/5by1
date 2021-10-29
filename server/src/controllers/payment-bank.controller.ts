import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Payment, Bank} from '../models';
import {PaymentRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class PaymentBankController {

  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/bank', {
    responses: {
      '200': {
        description: 'Bank belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Bank)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.paymentView.name,
    ...adminAndUserAuthDetails})
  async getBank(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Bank> {

    const bankR = await this.paymentRepository.bank(id);
    return bankR;

  }

}
