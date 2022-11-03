import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, RequestContext } from '@loopback/rest';
import {FinYear} from '../models/fin-year.model';
import { FIN_YEAR_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { Getter, inject, intercept } from '@loopback/context';
import { ValidateFinYearForUniqueCodeInterceptor } from '../interceptors/validate-finyear-for-unique-code.interceptor';
import {SecurityBindings} from '@loopback/security';
import { ProfileUser } from '../services';
import { BranchRepository, LedgerGroupRepository, LedgerRepository } from '../repositories';
import { FinYearTC } from '../utils/fin-year-tc';
import { service } from '@loopback/core';
import { FinyearService } from '../services/finyear.service';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class FinYearController {

  constructor(@service(FinyearService) public finyearService: FinyearService,) {}

  @intercept(ValidateFinYearForUniqueCodeInterceptor.BINDING_KEY)
  @post(FIN_YEAR_API)
  @response(200, {
    description: 'FinYear model instance',
    content: {'application/json': {schema: getModelSchemaRef(FinYear)}},
  })
  @authorize({resource: resourcePermissions.finyearCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FinYearTC, {
            title: 'NewFinYear',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      finYear: Omit<FinYearTC, 'id'>,

    @inject.context() context: RequestContext,
    @repository(BranchRepository)
      bchRep : BranchRepository,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
    @repository.getter('LedgerGroupRepository') lgrGetr: Getter<LedgerGroupRepository>,
    @repository.getter('LedgerRepository') ldgGetr: Getter<LedgerRepository>,
  ): Promise<FinYear> {

    const resp = await this.finyearService.create(finYear, context, bchRep, uProfile, lgrGetr, ldgGetr);
    return resp;

  }

  @get(`${FIN_YEAR_API}/count`)
  @response(200, {
    description: 'FinYear model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(FinYear) where?: Where<FinYear>,
  ): Promise<Count> {

    const countR = await this.finyearService.count(where);
    return countR;

  }

  @get(FIN_YEAR_API)
  @response(200, {
    description: 'Array of FinYear model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FinYear, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(FinYear) filter?: Filter<FinYear>,
  ): Promise<FinYear[]> {

    const finYearsR = await this.finyearService.find(filter);
    return finYearsR;

  }

  @patch(FIN_YEAR_API)
  @response(200, {
    description: 'FinYear PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.finyearUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FinYear, {partial: true}),
        },
      },
    })
      finYear: FinYear,
    @param.where(FinYear) where?: Where<FinYear>,
  ): Promise<Count> {

    const countR = await this.finyearService.updateAll(finYear, where);
    return countR;

  }

  @get(`${FIN_YEAR_API}/{id}`)
  @response(200, {
    description: 'FinYear model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FinYear, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FinYear, {exclude: 'where'}) filter?: FilterExcludingWhere<FinYear>
  ): Promise<FinYear> {

    const finYearR = await this.finyearService.findById(id, filter);
    return finYearR;

  }

  @patch(`${FIN_YEAR_API}/{id}`)
  @response(204, {
    description: 'FinYear PATCH success',
  })
  @authorize({resource: resourcePermissions.finyearUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FinYear, {partial: true}),
        },
      },
    })
      finYear: FinYear,
  ): Promise<void> {

    await this.finyearService.updateById(id, finYear);

  }

  @put(`${FIN_YEAR_API}/{id}`)
  @response(204, {
    description: 'FinYear PUT success',
  })
  @authorize({resource: resourcePermissions.finyearUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() finYear: FinYear,
  ): Promise<void> {

    await this.finyearService.replaceById(id, finYear);

  }

  @del(`${FIN_YEAR_API}/{id}`)
  @response(204, {
    description: 'FinYear DELETE success',
  })
  @authorize({resource: resourcePermissions.finyearDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.finyearService.deleteById(id);

  }

  @del(FIN_YEAR_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.finyearDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(FinYear) where?: Where<FinYear>,
  ): Promise<Count> {

    const count = await this.finyearService.deleteAll(where);
    return count;

  }


}
