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
  Invoice,
} from '../models';
import {RevenueRepository} from '../repositories';

export class RevenueInvoiceController {
  constructor(
    @repository(RevenueRepository)
    public revenueRepository: RevenueRepository,
  ) { }

  @get('/revenues/{id}/invoice', {
    responses: {
      '200': {
        description: 'Invoice belonging to Revenue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Invoice)},
          },
        },
      },
    },
  })
  async getInvoice(
    @param.path.string('id') id: typeof Revenue.prototype.id,
  ): Promise<Invoice> {
    return this.revenueRepository.invoice(id);
  }
}
