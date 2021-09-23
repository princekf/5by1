import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Transfer} from '../models';
import {TransferRepository} from '../repositories';
import {TRANSFER_API} from '@shared/server-apis';

import { authenticate } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
export class TransferController {

  constructor(
    @repository(TransferRepository)
    public transferRepository : TransferRepository,
  ) {}

  @post(TRANSFER_API)
  @response(200, {
    description: 'Transfer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transfer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transfer, {
            title: 'NewTransfer',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      transfer: Omit<Transfer, 'id'>,
  ): Promise<Transfer> {

    const transferR = await this.transferRepository.create(transfer);
    return transferR;

  }

  @get(`${TRANSFER_API}/count`)
  @response(200, {
    description: 'Transfer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Transfer) where?: Where<Transfer>,
  ): Promise<Count> {

    const count = await this.transferRepository.count(where);
    return count;

  }

  @get(TRANSFER_API)
  @response(200, {
    description: 'Array of Transfer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transfer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Transfer) filter?: Filter<Transfer>,
  ): Promise<Transfer[]> {

    const transfers = await this.transferRepository.find(filter);
    return transfers;

  }

  @patch(TRANSFER_API)
  @response(200, {
    description: 'Transfer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transfer, {partial: true}),
        },
      },
    })
      transfer: Transfer,
    @param.where(Transfer) where?: Where<Transfer>,
  ): Promise<Count> {

    const count = await this.transferRepository.updateAll(transfer, where);
    return count;

  }

  @get(`${TRANSFER_API}/{id}`)
  @response(200, {
    description: 'Transfer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transfer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Transfer, {exclude: 'where'}) filter?: FilterExcludingWhere<Transfer>
  ): Promise<Transfer> {

    const transferR = await this.transferRepository.findById(id, filter);
    return transferR;

  }

  @patch(`${TRANSFER_API}/{id}`)
  @response(204, {
    description: 'Transfer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transfer, {partial: true}),
        },
      },
    })
      transfer: Transfer,
  ): Promise<void> {

    await this.transferRepository.updateById(id, transfer);

  }

  @put(`${TRANSFER_API}/{id}`)
  @response(204, {
    description: 'Transfer PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transfer: Transfer,
  ): Promise<void> {

    await this.transferRepository.replaceById(id, transfer);

  }

  @del(`${TRANSFER_API}/{id}`)
  @response(204, {
    description: 'Transfer DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.transferRepository.deleteById(id);

  }

  @del(TRANSFER_API)
  @response(204, {
    description: 'Transfers DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Transfer) where?: Where<Transfer>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Transfer ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Transfer ids are required');

    }

    const count = await this.transferRepository.deleteAll(where);
    return count;

  }

}
