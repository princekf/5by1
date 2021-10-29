import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors} from '@loopback/rest';
import {Unit} from '../models';
import {UnitRepository} from '../repositories';
import { UNIT_API } from '@shared/server-apis';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class UnitController {

  constructor(
    @repository(UnitRepository)
    public unitRepository : UnitRepository,
  ) {}

  @post(UNIT_API)
  @response(200, {
    description: 'Unit model instance',
    content: {'application/json': {schema: getModelSchemaRef(Unit)}},
  })
  @authorize({resource: resourcePermissions.unitCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Unit, {
            title: 'NewUnit',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      unit: Omit<Unit, 'id'>,
  ): Promise<Unit> {

    const unitR = await this.unitRepository.create(unit);
    return unitR;

  }

  @get(`${UNIT_API}/count`)
  @response(200, {
    description: 'Unit model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.unitView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Unit) where?: Where<Unit>,
  ): Promise<Count> {

    const count = await this.unitRepository.count(where);
    return count;

  }

  @get(UNIT_API)
  @response(200, {
    description: 'Array of Unit model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Unit, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.unitView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Unit) filter?: Filter<Unit>,
  ): Promise<Unit[]> {

    const units = await this.unitRepository.find(filter);
    const parentIds:Array<string> = units.map((unitP) => unitP.parentId).filter((paId) => Boolean(paId));
    const parents = await this.unitRepository.find({where: {id: {inq: parentIds}}});
    const parentMap = Object.assign({}, ...parents.map((sPar) => ({[sPar.id ?? '']: sPar})));
    const unitsWP = units.map((unitP) => {

      if (unitP.parentId) {

        unitP.parent = parentMap[unitP.parentId];

      }
      return unitP;

    });
    return unitsWP;

  }

  @patch(UNIT_API)
  @response(200, {
    description: 'Unit PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.unitUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Unit, {partial: true}),
        },
      },
    })
      unit: Unit,
    @param.where(Unit) where?: Where<Unit>,
  ): Promise<Count> {

    const count = await this.unitRepository.updateAll(unit, where);
    return count;

  }

  @get(`${UNIT_API}/{id}`)
  @response(200, {
    description: 'Unit model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Unit, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.unitView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Unit, {exclude: 'where'}) filter?: FilterExcludingWhere<Unit>
  ): Promise<Unit> {

    const unitR = await this.unitRepository.findById(id, filter);
    if (unitR.parentId) {

      const unitParent = await this.unitRepository.findById(unitR.parentId, {});
      unitR.parent = unitParent;

    }
    return unitR;

  }

  @patch(`${UNIT_API}/{id}`)
  @response(204, {
    description: 'Unit PATCH success',
  })
  @authorize({resource: resourcePermissions.unitUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Unit, {partial: true}),
        },
      },
    })
      unit: Unit,
  ): Promise<void> {

    await this.unitRepository.updateById(id, unit);

  }

  @put(`${UNIT_API}/{id}`)
  @response(204, {
    description: 'Unit PUT success',
  })
  @authorize({resource: resourcePermissions.unitUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() unit: Unit,
  ): Promise<void> {

    await this.unitRepository.replaceById(id, unit);

  }

  @del(`${UNIT_API}/{id}`)
  @response(204, {
    description: 'Unit DELETE success',
  })
  @authorize({resource: resourcePermissions.unitDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.unitRepository.deleteById(id);

  }


  @del(UNIT_API)
  @response(204, {
    description: 'Units DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.unitDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Unit) where?: Where<Unit>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Units ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Units ids are required');

    }

    const count = await this.unitRepository.deleteAll(where);
    return count;

  }

}
