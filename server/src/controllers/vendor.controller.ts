import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Vendor} from '../models';
import {VendorRepository} from '../repositories';
import { VENDOR_API } from '@shared/server-apis';
import { ArrayReponse } from '../models/util/array-resp.model';
import { ArrayResponse as ArrayReponseInft } from '@shared/util/array-resp';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class VendorController {

  constructor(
    @repository(VendorRepository)
    public vendorRepository : VendorRepository,
  ) {}

  @post(VENDOR_API)
  @response(200, {
    description: 'Vendor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vendor)}},
  })
  @authorize({resource: resourcePermissions.vendorCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {
            title: 'NewVendor',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      vendor: Omit<Vendor, 'id'>,
  ): Promise<Vendor> {

    const vendorR = await this.vendorRepository.create(vendor);
    return vendorR;

  }

  @get(`${VENDOR_API}/distinct/{column}`)
  @response(200, {
    description: 'Tax model group names',
    content: {'application/json': {schema: ArrayReponse}},
  })
  @authorize({resource: resourcePermissions.vendorView.name,
    ...adminAndUserAuthDetails})
  async distinct(
    @param.path.string('column') column: string,
    @param.filter(Vendor) filter?: Filter<Vendor>,
  ): Promise<ArrayReponseInft> {

    const resp = await this.vendorRepository.distinct(column, filter);
    return resp;

  }

  @get(`${VENDOR_API}/count`)
  @response(200, {
    description: 'Vendor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.vendorView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Vendor) where?: Where<Vendor>,
  ): Promise<Count> {

    const count = await this.vendorRepository.count(where);
    return count;

  }

  @get(VENDOR_API)
  @response(200, {
    description: 'Array of Vendor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vendor, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.vendorView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Vendor) filter?: Filter<Vendor>,
  ): Promise<Vendor[]> {

    const vendors = await this.vendorRepository.find(filter);
    return vendors;

  }

  @patch(VENDOR_API)
  @response(200, {
    description: 'Vendor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.vendorUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {partial: true}),
        },
      },
    })
      vendor: Vendor,
    @param.where(Vendor) where?: Where<Vendor>,
  ): Promise<Count> {

    const count = await this.vendorRepository.updateAll(vendor, where);
    return count;

  }

  @get(`${VENDOR_API}/{id}`)
  @response(200, {
    description: 'Vendor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vendor, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.vendorView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Vendor, {exclude: 'where'}) filter?: FilterExcludingWhere<Vendor>
  ): Promise<Vendor> {

    const vendorR = await this.vendorRepository.findById(id, filter);
    return vendorR;

  }

  @patch(`${VENDOR_API}/{id}`)
  @response(204, {
    description: 'Vendor PATCH success',
  })
  @authorize({resource: resourcePermissions.vendorUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {partial: true}),
        },
      },
    })
      vendor: Vendor,
  ): Promise<void> {

    await this.vendorRepository.updateById(id, vendor);

  }

  @put(`${VENDOR_API}/{id}`)
  @response(204, {
    description: 'Vendor PUT success',
  })
  @authorize({resource: resourcePermissions.vendorUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() vendor: Vendor,
  ): Promise<void> {

    await this.vendorRepository.replaceById(id, vendor);

  }

  @del(`${VENDOR_API}/{id}`)
  @response(204, {
    description: 'Vendor DELETE success',
  })
  @authorize({resource: resourcePermissions.vendorDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.vendorRepository.deleteById(id);

  }

  @del(VENDOR_API)
  @response(204, {
    description: 'Vendors DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.vendorDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Vendor) where?: Where<Vendor>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Vendor ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Vendor ids are required');

    }

    const count = await this.vendorRepository.deleteAll(where);
    return count;

  }

}
