import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Payment,
  Bill,
} from '../models';
import {PaymentRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Bill)},
          },
        },
      },
    },
  })
  async getBill(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Bill> {
    return this.paymentRepository.bill(id);
  }
}
