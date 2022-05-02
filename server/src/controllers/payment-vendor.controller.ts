import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Payment, Vendor} from '../models';
import {PaymentRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class PaymentVendorController {

  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/vendor', {
    responses: {
      '200': {
        description: 'Vendor belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Vendor)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.paymentView.name,
    ...adminAndUserAuthDetails})
  async getVendor(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Vendor> {

    const vendorR = await this.paymentRepository.vendor(id);
    return vendorR;

  }

}
