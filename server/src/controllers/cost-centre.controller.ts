import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors} from '@loopback/rest';
import {CostCentre} from '../models/cost-centre.model';
import {CostCentreRepository} from '../repositories/cost-centre.repository';
import { COST_CENTRE_API} from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class CostCentreController {

  constructor(
    @repository(CostCentreRepository)
    public costCentreRepository : CostCentreRepository,
  ) {}

  @post(COST_CENTRE_API)
  @response(200, {
    description: 'CostCentre model instance',
    content: {'application/json': {schema: getModelSchemaRef(CostCentre)}},
  })
  @authorize({resource: resourcePermissions.costcentreCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CostCentre, {
            title: 'NewCostCentre',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      costCentre: Omit<CostCentre, 'id'>,
  ): Promise<CostCentre> {

    const costR = await this.costCentreRepository.create(costCentre);
    return costR;

  }

  @get(`${COST_CENTRE_API}/count`)
  @response(200, {
    description: 'CostCentre model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.costcentreView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(CostCentre) where?: Where<CostCentre>,
  ): Promise<Count> {

    const countR = await this.costCentreRepository.count(where);
    return countR;

  }

  @get(COST_CENTRE_API)
  @response(200, {
    description: 'Array of CostCentre model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CostCentre, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.costcentreView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(CostCentre) filter?: Filter<CostCentre>,
  ): Promise<CostCentre[]> {

    const costsR = await this.costCentreRepository.find(filter);
    return costsR;

  }

  @patch(COST_CENTRE_API)
  @response(200, {
    description: 'CostCentre PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.costcentreUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CostCentre, {partial: true}),
        },
      },
    })
      costCentre: CostCentre,
    @param.where(CostCentre) where?: Where<CostCentre>,
  ): Promise<Count> {

    const countR = await this.costCentreRepository.updateAll(costCentre, where);
    return countR;

  }

  @get(`${COST_CENTRE_API}/{id}`)
  @response(200, {
    description: 'CostCentre model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CostCentre, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.costcentreView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(CostCentre, {exclude: 'where'}) filter?: FilterExcludingWhere<CostCentre>
  ): Promise<CostCentre> {

    const costR = await this.costCentreRepository.findById(id, filter);
    return costR;

  }

  @patch(`${COST_CENTRE_API}/{id}`)
  @response(204, {
    description: 'CostCentre PATCH success',
  })
  @authorize({resource: resourcePermissions.costcentreUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CostCentre, {partial: true}),
        },
      },
    })
      costCentre: CostCentre,
  ): Promise<void> {

    await this.costCentreRepository.updateById(id, costCentre);

  }

  @put(`${COST_CENTRE_API}/{id}`)
  @response(204, {
    description: 'CostCentre PUT success',
  })
  @authorize({resource: resourcePermissions.costcentreUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() costCentre: CostCentre,
  ): Promise<void> {

    await this.costCentreRepository.replaceById(id, costCentre);

  }

  @del(`${COST_CENTRE_API}/{id}`)
  @response(204, {
    description: 'CostCentre DELETE success',
  })
  @authorize({resource: resourcePermissions.costcentreDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.costCentreRepository.deleteById(id);

  }

  @del(COST_CENTRE_API)
  @response(204, {
    description: 'CostCentre DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.costcentreDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(CostCentre) where?: Where<CostCentre>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : CostCentre ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : CostCentre ids are required');

    }

    const count = await this.costCentreRepository.deleteAll(where);
    return count;

  }

}
