import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Payment} from '../models';
import {PaymentRepository} from '../repositories/payment.repository';
import { PAYMENT_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
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
  @authorize({resource: resourcePermissions.paymentCreate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentView.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentView.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentUpdate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentView.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentUpdate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentUpdate.name,
    ...adminAndUserAuthDetails})
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
  @authorize({resource: resourcePermissions.paymentDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.paymentRepository.deleteById(id);

  }

  @del(PAYMENT_API)
  @response(204, {
    description: 'Payments DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.paymentDelete.name,
    ...adminAndUserAuthDetails})
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
