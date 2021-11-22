import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors } from '@loopback/rest';
import {Voucher} from '../models/voucher.model';
import {VoucherRepository} from '../repositories/voucher.repository';
import { VOUCHER_API } from '@shared/server-apis';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { ValidateVoucherInterceptor } from '../interceptors/validate-voucher.interceptor';
import { inject, intercept } from '@loopback/context';
import { ProfileUser } from '../services';
import {SecurityBindings} from '@loopback/security';
import { FinYearRepository } from '../repositories';
import { FinYear } from '@shared/entity/auth/fin-year';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class VoucherController {

  constructor(
    @repository(VoucherRepository)
    public voucherRepository : VoucherRepository,
  ) {}

  @intercept(ValidateVoucherInterceptor.BINDING_KEY)
  @post(VOUCHER_API)
  @response(200, {
    description: 'Voucher model instance',
    content: {'application/json': {schema: getModelSchemaRef(Voucher)}},
  })
  @authorize({resource: resourcePermissions.voucherCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Voucher, {
            title: 'NewVoucher',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      voucher: Omit<Voucher, 'id'>,
      @inject(SecurityBindings.USER) uProfile: ProfileUser,
      @repository(FinYearRepository)
      finYearRepository : FinYearRepository,
  ): Promise<Voucher> {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    if (!finYear) {

      throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

    }
    const otherDetails = finYear.extras as {lastVNo:number};
    const lastVNo = otherDetails?.lastVNo ?? 0;
    const nextVNo = lastVNo + 1;
    const nextVNoS = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();
    voucher.number = nextVNoS;
    const voucherR = await this.voucherRepository.create(voucher);
    await finYearRepository.updateById(finYear.id, {extras: {lastVNo: nextVNo}});
    return voucherR;

  }

  @get(`${VOUCHER_API}/count`)
  @response(200, {
    description: 'Voucher model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Voucher) where?: Where<Voucher>,
  ): Promise<Count> {

    const countR = await this.voucherRepository.count(where);
    return countR;

  }

  @get(VOUCHER_API)
  @response(200, {
    description: 'Array of Voucher model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Voucher, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Voucher) filter?: Filter<Voucher>,
  ): Promise<Voucher[]> {

    const vouchersR = await this.voucherRepository.find(filter);
    return vouchersR;

  }

  @patch(VOUCHER_API)
  @response(200, {
    description: 'Voucher PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.voucherUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Voucher, {partial: true}),
        },
      },
    })
      voucher: Voucher,
    @param.where(Voucher) where?: Where<Voucher>,
  ): Promise<Count> {

    const countR = await this.voucherRepository.updateAll(voucher, where);
    return countR;

  }

  @get(`${VOUCHER_API}/{id}`)
  @response(200, {
    description: 'Voucher model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Voucher, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Voucher, {exclude: 'where'}) filter?: FilterExcludingWhere<Voucher>
  ): Promise<Voucher> {

    const voucherR = await this.voucherRepository.findById(id, filter);
    return voucherR;

  }

  @patch(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher PATCH success',
  })
  @authorize({resource: resourcePermissions.voucherUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Voucher, {partial: true}),
        },
      },
    })
      voucher: Voucher,
  ): Promise<void> {

    await this.voucherRepository.updateById(id, voucher);

  }

  @put(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher PUT success',
  })
  @authorize({resource: resourcePermissions.voucherUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() voucher: Voucher,
  ): Promise<void> {

    await this.voucherRepository.replaceById(id, voucher);

  }

  @del(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher DELETE success',
  })
  @authorize({resource: resourcePermissions.voucherDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.voucherRepository.deleteById(id);

  }

  @del(VOUCHER_API)
  @response(204, {
    description: 'Voucher DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.voucherDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Voucher) where?: Where<Voucher>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Voucher ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Voucher ids are required');

    }

    const count = await this.voucherRepository.deleteAll(where);
    return count;

  }


}
