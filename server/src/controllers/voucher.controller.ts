import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, RestBindings,
  Response, Request } from '@loopback/rest';
import {Voucher} from '../models/voucher.model';
import { VOUCHER_API } from '@shared/server-apis';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { ValidateVoucherInterceptor } from '../interceptors/validate-voucher.interceptor';
import { inject, intercept } from '@loopback/context';
import { ProfileUser, VoucherService } from '../services';
import {SecurityBindings} from '@loopback/security';
import { FinYearRepository, LedgerRepository } from '../repositories';
import {FileUploadHandler} from '../types';
import { BindingKeys } from '../binding.keys';
import { Ledger } from '../models';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { service } from '@loopback/core';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class VoucherController {

  constructor(
    @service(VoucherService) public voucherService: VoucherService,
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

    const resp = await this.voucherService.create(voucher, uProfile, finYearRepository);
    return resp;

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

    const countR = await this.voucherService.count(where);
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

    const vouchersR = await this.voucherService.find(filter);
    return vouchersR;

  }

  @get(`${VOUCHER_API}/ledgers-used/{vType}`)
  @response(200, {
    description: 'List of ledgers used by voucher type',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ledger, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.voucherView.name,
    ...adminAndUserAuthDetails})
  async ledgersUsed(@param.path.string('vType') vType: string,): Promise<Ledger[]> {

    const resp = await this.voucherService.ledgersUsed(vType);
    return resp;

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

    const countR = await this.voucherService.updateAll(voucher, where);
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

    const voucherR = await this.voucherService.findById(id, filter);
    return voucherR;

  }

  @intercept(ValidateVoucherInterceptor.BINDING_KEY)
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

    await this.voucherService.updateById(id, voucher);

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

    await this.voucherService.replaceById(id, voucher);

  }

  @del(`${VOUCHER_API}/{id}`)
  @response(204, {
    description: 'Voucher DELETE success',
  })
  @authorize({resource: resourcePermissions.voucherDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.voucherService.deleteById(id);

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

    const count = await this.voucherService.deleteAll(where);
    return count;

  }

  @post(`${VOUCHER_API}/import`, {
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
  async importVouchers(
    @requestBody.file()
      req: Request,
    @inject(RestBindings.Http.RESPONSE) resp: Response,
    @inject(BindingKeys.FILE_UPLOAD_SERVICE) fUpdHndlr: FileUploadHandler,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
    @repository(FinYearRepository) fyRep : FinYearRepository,
    @repository(LedgerRepository) ldgRep : LedgerRepository,
  ): Promise<unknown> {

    const vouchersData = await this.voucherService.importVouchers(req, resp, fUpdHndlr, uProfile, fyRep, ldgRep);
    return vouchersData;

  }

}
