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
  Bank,
} from '../models';
import {RevenueRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Bank)},
          },
        },
      },
    },
  })
  async getBank(
    @param.path.string('id') id: typeof Revenue.prototype.id,
  ): Promise<Bank> {
    return this.revenueRepository.bank(id);
  }
}
