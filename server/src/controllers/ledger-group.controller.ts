import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors } from '@loopback/rest';
import {LedgerGroup} from '../models/ledger-group.model';
import {LedgerGroupRepository} from '../repositories/ledger-group.repository';
import { LEDGER_GROUP_API } from '@shared/server-apis';

export class LedgerGroupController {

  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository : LedgerGroupRepository,
  ) {}

  @post(LEDGER_GROUP_API)
  @response(200, {
    description: 'LedgerGroup model instance',
    content: {'application/json': {schema: getModelSchemaRef(LedgerGroup)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LedgerGroup, {
            title: 'NewLedgerGroup',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      ledgerGroup: Omit<LedgerGroup, 'id'>,
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerGroupRepository.create(ledgerGroup);
    return lgR;

  }

  @get(`${LEDGER_GROUP_API}/count`)
  @response(200, {
    description: 'LedgerGroup model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    const countR = await this.ledgerGroupRepository.count(where);
    return countR;

  }

  @get(LEDGER_GROUP_API)
  @response(200, {
    description: 'Array of LedgerGroup model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LedgerGroup, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LedgerGroup) filter?: Filter<LedgerGroup>,
  ): Promise<LedgerGroup[]> {

    const lgsR = await this.ledgerGroupRepository.find(filter);
    return lgsR;

  }

  @patch(LEDGER_GROUP_API)
  @response(200, {
    description: 'LedgerGroup PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LedgerGroup, {partial: true}),
        },
      },
    })
      ledgerGroup: LedgerGroup,
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    const countR = await this.ledgerGroupRepository.updateAll(ledgerGroup, where);
    return countR;

  }

  @get(`${LEDGER_GROUP_API}/{id}`)
  @response(200, {
    description: 'LedgerGroup model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LedgerGroup, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(LedgerGroup, {exclude: 'where'}) filter?: FilterExcludingWhere<LedgerGroup>
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerGroupRepository.findById(id, filter);
    return lgR;

  }

  @patch(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LedgerGroup, {partial: true}),
        },
      },
    })
      ledgerGroup: LedgerGroup,
  ): Promise<void> {

    await this.ledgerGroupRepository.updateById(id, ledgerGroup);

  }

  @put(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledgerGroup: LedgerGroup,
  ): Promise<void> {

    await this.ledgerGroupRepository.replaceById(id, ledgerGroup);

  }

  @del(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.ledgerGroupRepository.deleteById(id);

  }

  @del(LEDGER_GROUP_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }

    const count = await this.ledgerGroupRepository.deleteAll(where);
    return count;

  }


}
