import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Payment} from '../models';
import {PaymentRepository} from '../repositories/payment.repository';
import { PAYMENT_API } from '@shared/server-apis';

export class PaymentController {

  constructor(
    @repository(PaymentRepository)
    public paymentRepository : PaymentRepository,
  ) {}

  @post(PAYMENT_API)
  @response(200, {
    description: 'Payment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Payment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPayment',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      payment: Omit<Payment, 'id'>,
  ): Promise<Payment> {

    const paymentR = await this.paymentRepository.create(payment);
    return paymentR;

  }

  @get(`${PAYMENT_API}/count`)
  @response(200, {
    description: 'Payment model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Payment) where?: Where<Payment>,
  ): Promise<Count> {

    const count = await this.paymentRepository.count(where);
    return count;

  }

  @get(PAYMENT_API)
  @response(200, {
    description: 'Array of Payment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Payment) filter?: Filter<Payment>,
  ): Promise<Payment[]> {

    const payments = await this.paymentRepository.find(filter);
    return payments;

  }

  @patch(PAYMENT_API)
  @response(200, {
    description: 'Payment PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
      payment: Payment,
    @param.where(Payment) where?: Where<Payment>,
  ): Promise<Count> {

    const count = await this.paymentRepository.updateAll(payment, where);
    return count;

  }

  @get(`${PAYMENT_API}/{id}`)
  @response(200, {
    description: 'Payment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Payment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Payment, {exclude: 'where'}) filter?: FilterExcludingWhere<Payment>
  ): Promise<Payment> {

    const paymentR = await this.paymentRepository.findById(id, filter);
    return paymentR;

  }

  @patch(`${PAYMENT_API}/{id}`)
  @response(204, {
    description: 'Payment PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
      payment: Payment,
  ): Promise<void> {

    await this.paymentRepository.updateById(id, payment);

  }

  @put(`${PAYMENT_API}/{id}`)
  @response(204, {
    description: 'Payment PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() payment: Payment,
  ): Promise<void> {

    await this.paymentRepository.replaceById(id, payment);

  }

  @del(`${PAYMENT_API}/{id}`)
  @response(204, {
    description: 'Payment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.paymentRepository.deleteById(id);

  }

  @del(PAYMENT_API)
  @response(204, {
    description: 'Payments DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Payment) where?: Where<Payment>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Payment ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Payment ids are required');

    }

    const count = await this.paymentRepository.deleteAll(where);
    return count;

  }

}
