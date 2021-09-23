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
  Vendor,
} from '../models';
import {PaymentRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Vendor)},
          },
        },
      },
    },
  })
  async getVendor(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Vendor> {
    return this.paymentRepository.vendor(id);
  }
}
