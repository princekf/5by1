import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, } from '@loopback/rest';
import {Bill} from '../models';
import {BillRepository} from '../repositories';
import { BILL_API } from '@shared/server-apis';

export class BillController {

  constructor(
    @repository(BillRepository)
    public billRepository : BillRepository,
  ) {}

  @post(BILL_API)
  @response(200, {
    description: 'Bill model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bill)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bill, {
            title: 'NewBill',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      bill: Omit<Bill, 'id'>,
  ): Promise<Bill> {

    const billP = await this.billRepository.create(bill);
    return billP;

  }

  @get(`${BILL_API}/count`)
  @response(200, {
    description: 'Bill model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Bill) where?: Where<Bill>,
  ): Promise<Count> {

    const count = await this.billRepository.count(where);
    return count;

  }

  @get(BILL_API)
  @response(200, {
    description: 'Array of Bill model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bill, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Bill) filter?: Filter<Bill>,
  ): Promise<Bill[]> {

    const bills = await this.billRepository.find(filter);
    return bills;

  }

  @patch(BILL_API)
  @response(200, {
    description: 'Bill PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bill, {partial: true}),
        },
      },
    })
      bill: Bill,
    @param.where(Bill) where?: Where<Bill>,
  ): Promise<Count> {

    const count = await this.billRepository.updateAll(bill, where);
    return count;

  }

  @get(`${BILL_API}/{id}`)
  @response(200, {
    description: 'Bill model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bill, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bill, {exclude: 'where'}) filter?: FilterExcludingWhere<Bill>
  ): Promise<Bill> {

    const billP = await this.billRepository.findById(id, filter);
    return billP;

  }

  @patch(`${BILL_API}/{id}`)
  @response(204, {
    description: 'Bill PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bill, {partial: true}),
        },
      },
    })
      bill: Bill,
  ): Promise<void> {

    await this.billRepository.updateById(id, bill);

  }

  @put(`${BILL_API}/{id}`)
  @response(204, {
    description: 'Bill PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bill: Bill,
  ): Promise<void> {

    await this.billRepository.replaceById(id, bill);

  }

  @del(`${BILL_API}/{id}`)
  @response(204, {
    description: 'Bill DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.billRepository.deleteById(id);

  }

}
