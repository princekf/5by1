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
  Bank,
} from '../models';
import {PaymentRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Bank)},
          },
        },
      },
    },
  })
  async getBank(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Bank> {
    return this.paymentRepository.bank(id);
  }
}
