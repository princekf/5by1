import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import { Revenue, Customer} from '../models';
import {RevenueRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class RevenueCustomerController {

  constructor(
    @repository(RevenueRepository)
    public revenueRepository: RevenueRepository,
  ) { }

  @get('/revenues/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Revenue',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.revenueView.name,
    ...adminAndUserAuthDetails})
  async getCustomer(
    @param.path.string('id') id: typeof Revenue.prototype.id,
  ): Promise<Customer> {

    const customerR = await this.revenueRepository.customer(id);
    return customerR;

  }

}
