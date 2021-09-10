import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post,
  param, get, getModelSchemaRef, patch, put, del, requestBody, response, } from '@loopback/rest';
import {Customer} from '../models';
import {CustomerRepository} from '../repositories';
import { CUSTOMER_API } from '@shared/server-apis';

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

}
