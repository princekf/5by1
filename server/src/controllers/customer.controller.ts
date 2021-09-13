import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post,
  param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Customer} from '../models';
import {CustomerRepository} from '../repositories';
import { CUSTOMER_API } from '@shared/server-apis';
import { ArrayReponse } from '../models/util/array-resp.model';
import { ArrayReponse as ArrayReponseInft } from '@shared/util/array-resp';

export class CustomerController {

  constructor(
    @repository(CustomerRepository)
    public customerRepository : CustomerRepository,
  ) {}

  @post(CUSTOMER_API)
  @response(200, {
    description: 'Customer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      customer: Omit<Customer, 'id'>,
  ): Promise<Customer> {

    const customerR = await this.customerRepository.create(customer);
    return customerR;

  }

  @get(`${CUSTOMER_API}/distinct/{column}`)
  @response(200, {
    description: 'Tax model group names',
    content: {'application/json': {schema: ArrayReponse}},
  })
  async distinct(
    @param.path.string('column') column: string,
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<ArrayReponseInft> {

    const resp = await this.customerRepository.distinct(column, filter);
    return resp;

  }

  @get(`${CUSTOMER_API}/count`)
  @response(200, {
    description: 'Customer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {

    const count = await this.customerRepository.count(where);
    return count;

  }

  @get(CUSTOMER_API)
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {

    const customers = await this.customerRepository.find(filter);
    return customers;

  }

  @patch(CUSTOMER_API)
  @response(200, {
    description: 'Customer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
      customer: Customer,
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {

    const count = await this.customerRepository.updateAll(customer, where);
    return count;

  }

  @get(`${CUSTOMER_API}/{id}`)
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Customer, {exclude: 'where'}) filter?: FilterExcludingWhere<Customer>
  ): Promise<Customer> {

    const customerR = await this.customerRepository.findById(id, filter);
    return customerR;

  }

  @patch(`${CUSTOMER_API}/{id}`)
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
      customer: Customer,
  ): Promise<void> {

    await this.customerRepository.updateById(id, customer);

  }

  @put(`${CUSTOMER_API}/{id}`)
  @response(204, {
    description: 'Customer PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() customer: Customer,
  ): Promise<void> {

    await this.customerRepository.replaceById(id, customer);

  }

  @del(`${CUSTOMER_API}/{id}`)
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.customerRepository.deleteById(id);

  }

  @del(CUSTOMER_API)
  @response(204, {
    description: 'Customers DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Customer ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Customer ids are required');

    }

    const count = await this.customerRepository.deleteAll(where);
    return count;

  }

}
