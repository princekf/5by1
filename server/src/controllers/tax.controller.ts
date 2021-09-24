import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Tax} from '../models';
import {TaxRepository} from '../repositories';
import { TAX_API } from '@shared/server-apis';
import { ArrayReponse } from '../models/util/array-resp.model';
import { ArrayResponse as ArrayReponseInft } from '@shared/util/array-resp';

import { authenticate } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
export class TaxController {

  constructor(
    @repository(TaxRepository)
    public taxRepository : TaxRepository,
  ) {}

  @post(TAX_API)
  @response(200, {
    description: 'Tax model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tax)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tax, {
            title: 'NewTax',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      tax: Omit<Tax, 'id'>,
  ): Promise<Tax> {

    const taxR = await this.taxRepository.create(tax);
    return taxR;

  }

  @get(`${TAX_API}/distinct/{column}`)
  @response(200, {
    description: 'Tax model group names',
    content: {'application/json': {schema: ArrayReponse}},
  })
  async distinct(
    @param.path.string('column') column: string,
    @param.filter(Tax) filter?: Filter<Tax>,
  ): Promise<ArrayReponseInft> {

    const resp = await this.taxRepository.distinct(column, filter);
    return resp;

  }

  @get(`${TAX_API}/count`)
  @response(200, {
    description: 'Tax model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tax) where?: Where<Tax>,
  ): Promise<Count> {

    const count = await this.taxRepository.count(where);
    return count;

  }

  @get(TAX_API)
  @response(200, {
    description: 'Array of Tax model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tax, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tax) filter?: Filter<Tax>,
  ): Promise<Tax[]> {

    const taxes = await this.taxRepository.find(filter);
    return taxes;

  }

  @patch(TAX_API)
  @response(200, {
    description: 'Tax PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tax, {partial: true}),
        },
      },
    })
      tax: Tax,
    @param.where(Tax) where?: Where<Tax>,
  ): Promise<Count> {

    const count = await this.taxRepository.updateAll(tax, where);
    return count;

  }

  @get(`${TAX_API}/{id}`)
  @response(200, {
    description: 'Tax model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tax, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Tax, {exclude: 'where'}) filter?: FilterExcludingWhere<Tax>
  ): Promise<Tax> {

    const taxR = await this.taxRepository.findById(id, filter);
    return taxR;

  }

  @patch(`${TAX_API}/{id}`)
  @response(204, {
    description: 'Tax PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tax, {partial: true}),
        },
      },
    })
      tax: Tax,
  ): Promise<void> {

    await this.taxRepository.updateById(id, tax);

  }

  @put(`${TAX_API}/{id}`)
  @response(204, {
    description: 'Tax PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tax: Tax,
  ): Promise<void> {

    await this.taxRepository.replaceById(id, tax);

  }

  @del(`${TAX_API}/{id}`)
  @response(204, {
    description: 'Tax DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.taxRepository.deleteById(id);

  }

  @del(TAX_API)
  @response(204, {
    description: 'Taxes DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Tax) where?: Where<Tax>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Tax ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Tax ids are required');

    }

    const count = await this.taxRepository.deleteAll(where);
    return count;

  }

}
