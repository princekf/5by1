import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post,
  param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Bank} from '../models';
import {BankRepository} from '../repositories';
import { BANK_API } from '@shared/server-apis';

export class BankController {

  constructor(
    @repository(BankRepository)
    public bankRepository : BankRepository,
  ) {}

  @post(BANK_API)
  @response(200, {
    description: 'Bank model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bank)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bank, {
            title: 'NewBank',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      bank: Omit<Bank, 'id'>,
  ): Promise<Bank> {

    const bankR = await this.bankRepository.create(bank);
    return bankR;

  }

  @get(`${BANK_API}/count`)
  @response(200, {
    description: 'Bank model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Bank) where?: Where<Bank>,
  ): Promise<Count> {

    const count = await this.bankRepository.count(where);
    return count;

  }

  @get(BANK_API)
  @response(200, {
    description: 'Array of Bank model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bank, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Bank) filter?: Filter<Bank>,
  ): Promise<Bank[]> {

    const banks = await this.bankRepository.find(filter);
    return banks;

  }

  @patch(BANK_API)
  @response(200, {
    description: 'Bank PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bank, {partial: true}),
        },
      },
    })
      bank: Bank,
    @param.where(Bank) where?: Where<Bank>,
  ): Promise<Count> {

    const count = await this.bankRepository.updateAll(bank, where);
    return count;

  }

  @get(`${BANK_API}/{id}`)
  @response(200, {
    description: 'Bank model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bank, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bank, {exclude: 'where'}) filter?: FilterExcludingWhere<Bank>
  ): Promise<Bank> {

    const bankR = await this.bankRepository.findById(id, filter);
    return bankR;

  }

  @patch(`${BANK_API}/{id}`)
  @response(204, {
    description: 'Bank PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bank, {partial: true}),
        },
      },
    })
      bank: Bank,
  ): Promise<void> {

    await this.bankRepository.updateById(id, bank);

  }

  @put(`${BANK_API}/{id}`)
  @response(204, {
    description: 'Bank PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bank: Bank,
  ): Promise<void> {

    await this.bankRepository.replaceById(id, bank);

  }

  @del(`${BANK_API}/{id}`)
  @response(204, {
    description: 'Bank DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.bankRepository.deleteById(id);

  }

  @del(BANK_API)
  @response(204, {
    description: 'Banks DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Bank) where?: Where<Bank>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Bank ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Bank ids are required');

    }

    const count = await this.bankRepository.deleteAll(where);
    return count;

  }

}
