import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors } from '@loopback/rest';
import {Revenue} from '../models/revenue.model';
import {RevenueRepository} from '../repositories/revenue.repository';
import { REVENUE_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
export class RevenueController {

  constructor(
    @repository(RevenueRepository)
    public revenueRepository : RevenueRepository,
  ) {}

  @post(REVENUE_API)
  @response(200, {
    description: 'Revenue model instance',
    content: {'application/json': {schema: getModelSchemaRef(Revenue)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Revenue, {
            title: 'NewRevenue',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      revenue: Omit<Revenue, 'id'>,
  ): Promise<Revenue> {

    const revenueR = await this.revenueRepository.create(revenue);
    return revenueR;

  }

  @get(`${REVENUE_API}/count`)
  @response(200, {
    description: 'Revenue model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Revenue) where?: Where<Revenue>,
  ): Promise<Count> {

    const countR = await this.revenueRepository.count(where);
    return countR;

  }

  @get(REVENUE_API)
  @response(200, {
    description: 'Array of Revenue model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Revenue, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Revenue) filter?: Filter<Revenue>,
  ): Promise<Revenue[]> {

    const revenues = await this.revenueRepository.find(filter);
    return revenues;

  }

  @patch(REVENUE_API)
  @response(200, {
    description: 'Revenue PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Revenue, {partial: true}),
        },
      },
    })
      revenue: Revenue,
    @param.where(Revenue) where?: Where<Revenue>,
  ): Promise<Count> {

    const countR = await this.revenueRepository.updateAll(revenue, where);
    return countR;

  }

  @get(`${REVENUE_API}/{id}`)
  @response(200, {
    description: 'Revenue model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Revenue, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Revenue, {exclude: 'where'}) filter?: FilterExcludingWhere<Revenue>
  ): Promise<Revenue> {

    const revenueR = await this.revenueRepository.findById(id, filter);
    return revenueR;

  }

  @patch(`${REVENUE_API}/{id}`)
  @response(204, {
    description: 'Revenue PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Revenue, {partial: true}),
        },
      },
    })
      revenue: Revenue,
  ): Promise<void> {

    await this.revenueRepository.updateById(id, revenue);

  }

  @put(`${REVENUE_API}/{id}`)
  @response(204, {
    description: 'Revenue PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() revenue: Revenue,
  ): Promise<void> {

    await this.revenueRepository.replaceById(id, revenue);

  }

  @del(`${REVENUE_API}/{id}`)
  @response(204, {
    description: 'Revenue DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.revenueRepository.deleteById(id);

  }

  @del(REVENUE_API)
  @response(204, {
    description: 'Revenues DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Revenue) where?: Where<Revenue>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Revenue ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Revenue ids are required');

    }

    const count = await this.revenueRepository.deleteAll(where);
    return count;

  }

}
