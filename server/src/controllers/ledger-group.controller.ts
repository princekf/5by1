import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors } from '@loopback/rest';
import {LedgerGroup} from '../models/ledger-group.model';
import {LedgerGroupRepository} from '../repositories/ledger-group.repository';
import { LEDGER_GROUP_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { intercept } from '@loopback/context';
import { ValidateLedgerGroupInterceptor } from '../interceptors/validate-ledgergroup.interceptor';
import { DenyDeletionOfDefaultLedgerGroup } from '../interceptors';
import { LedgerGroupWithParents } from '../models/ledger-group-with-parents.model';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class LedgerGroupController {

  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository : LedgerGroupRepository,
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

    const lgR = await this.ledgerGroupRepository.create(ledgerGroup);
    return lgR;

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
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(LedgerGroup) filter?: Filter<LedgerGroup>,
  ): Promise<LedgerGroup[]> {

    const lgsR = await this.ledgerGroupRepository.find(filter);
    return lgsR;

  }

  private fetchChilds = async(lgCodes: Array<string>):Promise<Array<LedgerGroup>> => {

    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', [
      {
        '$graphLookup': {
          'from': 'LedgerGroup',
          'startWith': '$parentId',
          'connectFromField': 'parentId',
          'connectToField': '_id',
          'as': 'parents',
        }
      },
      {
        '$addFields': {
          'id': '$_id',
        }
      },
      {
        '$addFields': {
          'parents': {
            '$filter': {
              'input': '$parents',
              'cond': { '$in': [ '$$this.code', lgCodes ] }
            }
          }
        }
      },
      {'$match': { '$or': [
        {'parents': {'$exists': true,
          '$not': {'$size': 0}}},
        {'code': {'$in': lgCodes}}
      ]}},
    ]);
    const lgsR = <Array<LedgerGroup>> await pQuery.toArray();
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

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const whereC = where as {code: {inq: Array<string>}};
    if (!whereC.code || !whereC.code.inq || whereC.code.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const lgsR = await this.fetchChilds(whereC.code.inq);
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
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(LedgerGroup, {exclude: 'where'}) filter?: FilterExcludingWhere<LedgerGroup>
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerGroupRepository.findById(id, filter);
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

    await this.ledgerGroupRepository.updateById(id, ledgerGroup);

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

    await this.ledgerGroupRepository.replaceById(id, ledgerGroup);

  }

  @del(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup DELETE success',
  })
  @authorize({resource: resourcePermissions.ledgergroupDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.ledgerGroupRepository.deleteById(id);

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
