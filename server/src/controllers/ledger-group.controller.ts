import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, Request, Response, RestBindings } from '@loopback/rest';
import {LedgerGroup} from '../models/ledger-group.model';
import { LEDGER_GROUP_API} from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { inject, intercept } from '@loopback/context';
import { ValidateLedgerGroupInterceptor } from '../interceptors/validate-ledgergroup.interceptor';
import { DenyDeletionOfDefaultLedgerGroup } from '../interceptors';
import { LedgerGroupWithParents } from '../models/ledger-group-with-parents.model';
import { BindingKeys } from '../binding.keys';
import { LedgerGroupService, ProfileUser } from '../services';
import { FileUploadHandler } from '../types';
import {SecurityBindings} from '@loopback/security';
import { FinYearRepository } from '../repositories';
import { LedgerGroupImport } from '../utils/ledgergroup-import-spec';
import { service } from '@loopback/core';
@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class LedgerGroupController {

  constructor(
    @service(LedgerGroupService) private ledgerGroupService: LedgerGroupService,
  ) {}

  @intercept(ValidateLedgerGroupInterceptor.BINDING_KEY)
  @post(LEDGER_GROUP_API)
  @response(200, {
    description: 'LedgerGroup model instance',
    content: {'application/json': {schema: getModelSchemaRef(LedgerGroup)}},
  })
  @authorize({resource: resourcePermissions.ledgergroupCreate.name,
    ...adminAndUserAuthDetails})
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


    const ledgergroupR = await this.ledgerGroupService.create(ledgerGroup);
    return ledgergroupR;

  }

  @get(`${LEDGER_GROUP_API}/count`)
  @response(200, {
    description: 'LedgerGroup model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    const countR = await this.ledgerGroupService.count(where);
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
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(LedgerGroup) filter?: Filter<LedgerGroup>,
  ): Promise<LedgerGroup[]> {

    const lgsR = await this.ledgerGroupService.find(filter);
    return lgsR;

  }

  @get(`${LEDGER_GROUP_API}/childs`)
  @response(200, {
    description: 'Childs of ledger groups',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LedgerGroupWithParents, {
            title: 'Ledger Groups with parents',
          }),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async childs(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<LedgerGroup[]> {

    const lgsR = await this.ledgerGroupService.childs(where);
    return lgsR;

  }

  @patch(LEDGER_GROUP_API)
  @response(200, {
    description: 'LedgerGroup PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgergroupUpdate.name,
    ...adminAndUserAuthDetails})
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

    const countR = await this.ledgerGroupService.updateAll(ledgerGroup, where);
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
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(LedgerGroup, {exclude: 'where'}) filter?: FilterExcludingWhere<LedgerGroup>
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerGroupService.findById(id, filter);
    return lgR;

  }

  @intercept(ValidateLedgerGroupInterceptor.BINDING_KEY)
  @patch(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup PATCH success',
  })
  @authorize({resource: resourcePermissions.ledgergroupUpdate.name,
    ...adminAndUserAuthDetails})
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

    await this.ledgerGroupService.updateById(id, ledgerGroup);

  }

  @intercept(ValidateLedgerGroupInterceptor.BINDING_KEY)
  @put(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup PUT success',
  })
  @authorize({resource: resourcePermissions.ledgergroupUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledgerGroup: LedgerGroup,
  ): Promise<void> {

    await this.ledgerGroupService.replaceById(id, ledgerGroup);

  }


  @del(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup DELETE success',
  })
  @authorize({resource: resourcePermissions.ledgergroupDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.ledgerGroupService.deleteById(id);

  }

  @intercept(DenyDeletionOfDefaultLedgerGroup.BINDING_KEY)
  @del(LEDGER_GROUP_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgergroupDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    const count = await this.ledgerGroupService.deleteAll(where);
    return count;

  }


  @post(`${LEDGER_GROUP_API}/import`, {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async importLedgerGroup(
    @requestBody.file()
      request: Request,
    @inject(RestBindings.Http.RESPONSE) response2: Response,
    @inject(BindingKeys.FILE_UPLOAD_SERVICE) fileUploadHandler: FileUploadHandler,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
    @repository(FinYearRepository) finYearRepository : FinYearRepository,
  ): Promise<LedgerGroupImport[]> {

    const resp = await this.ledgerGroupService
      .importLedgerGroup(request, response2, fileUploadHandler, uProfile, finYearRepository);
    return resp;

  }

}
