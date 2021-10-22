import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Ledger} from '../models';
import {LedgerRepository} from '../repositories';

export class LedgerController {
  constructor(
    @repository(LedgerRepository)
    public ledgerRepository : LedgerRepository,
  ) {}

  @post('/ledgers')
  @response(200, {
    description: 'Ledger model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ledger)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {
            title: 'NewLedger',
            exclude: ['id'],
          }),
        },
      },
    })
    ledger: Omit<Ledger, 'id'>,
  ): Promise<Ledger> {
    return this.ledgerRepository.create(ledger);
  }

  @get('/ledgers/count')
  @response(200, {
    description: 'Ledger model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.ledgerRepository.count(where);
  }

  @get('/ledgers')
  @response(200, {
    description: 'Array of Ledger model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ledger, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Ledger) filter?: Filter<Ledger>,
  ): Promise<Ledger[]> {
    return this.ledgerRepository.find(filter);
  }

  @patch('/ledgers')
  @response(200, {
    description: 'Ledger PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Ledger,
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.ledgerRepository.updateAll(ledger, where);
  }

  @get('/ledgers/{id}')
  @response(200, {
    description: 'Ledger model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ledger, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ledger, {exclude: 'where'}) filter?: FilterExcludingWhere<Ledger>
  ): Promise<Ledger> {
    return this.ledgerRepository.findById(id, filter);
  }

  @patch('/ledgers/{id}')
  @response(204, {
    description: 'Ledger PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Ledger,
  ): Promise<void> {
    await this.ledgerRepository.updateById(id, ledger);
  }

  @put('/ledgers/{id}')
  @response(204, {
    description: 'Ledger PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledger: Ledger,
  ): Promise<void> {
    await this.ledgerRepository.replaceById(id, ledger);
  }

  @del('/ledgers/{id}')
  @response(204, {
    description: 'Ledger DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ledgerRepository.deleteById(id);
  }
}
