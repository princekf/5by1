import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors } from '@loopback/rest';
import {Voucher} from '../models/voucher.model';
import {VoucherRepository} from '../repositories/voucher.repository';
import { VOUCHER_API } from '@shared/server-apis';

export class VoucherController {

  constructor(
    @repository(VoucherRepository)
    public voucherRepository : VoucherRepository,
  ) {}

  @post(VOUCHER_API)
  @response(200, {
    description: 'Voucher model instance',
    content: {'application/json': {schema: getModelSchemaRef(Voucher)}},
  })
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
  ): Promise<Voucher> {

    const voucherR = await this.voucherRepository.create(voucher);
    return voucherR;

  }

  @get(`${VOUCHER_API}/count`)
  @response(200, {
    description: 'Voucher model count',
    content: {'application/json': {schema: CountSchema}},
  })
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
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.voucherRepository.deleteById(id);

  }

  @del(VOUCHER_API)
  @response(204, {
    description: 'Voucher DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
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
