import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Revenue,
  Customer,
} from '../models';
import {RevenueRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.string('id') id: typeof Revenue.prototype.id,
  ): Promise<Customer> {
    return this.revenueRepository.customer(id);
  }
}
