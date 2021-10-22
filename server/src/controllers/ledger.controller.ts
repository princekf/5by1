import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors} from '@loopback/rest';
import {Ledger} from '../models';
import {LedgerRepository} from '../repositories';
import { LEDGER_API } from '@shared/server-apis';

export class LedgerController {

  constructor(
    @repository(LedgerRepository)
    public ledgerRepository : LedgerRepository,
  ) {}

  @post(LEDGER_API)
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
            exclude: [ 'id' ],
          }),
        },
      },
    })
      ledger: Omit<Ledger, 'id'>,
  ): Promise<Ledger> {

    const lgR = await this.ledgerRepository.create(ledger);
    return lgR;

  }

  @get(`${LEDGER_API}/count`)
  @response(200, {
    description: 'Ledger model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {

    const countR = await this.ledgerRepository.count(where);
    return countR;

  }

  @get(LEDGER_API)
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

    const lgsR = await this.ledgerRepository.find(filter);
    return lgsR;

  }

  @patch(LEDGER_API)
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

    const countR = await this.ledgerRepository.updateAll(ledger, where);
    return countR;

  }

  @get(`${LEDGER_API}/{id}`)
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

    const lgR = await this.ledgerRepository.findById(id, filter);
    return lgR;

  }

  @patch(`${LEDGER_API}/{id}`)
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

  @put(`${LEDGER_API}/{id}`)
  @response(204, {
    description: 'Ledger PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledger: Ledger,
  ): Promise<void> {

    await this.ledgerRepository.replaceById(id, ledger);

  }

  @del(`${LEDGER_API}/{id}`)
  @response(204, {
    description: 'Ledger DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.ledgerRepository.deleteById(id);

  }


  @del(LEDGER_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }

    const count = await this.ledgerRepository.deleteAll(where);
    return count;

  }


}
