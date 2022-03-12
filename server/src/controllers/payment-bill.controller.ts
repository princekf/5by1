import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Payment, Bill} from '../models';
import {PaymentRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class PaymentBillController {

  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/bill', {
    responses: {
      '200': {
        description: 'Bill belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Bill)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.paymentView.name,
    ...adminAndUserAuthDetails})
  async getBill(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Bill> {

    const billR = await this.paymentRepository.bill(id);
    return billR;

  }

}
