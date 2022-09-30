import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { service } from '@loopback/core';
import { Count, CountSchema, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { param, get, getModelSchemaRef, response } from '@loopback/rest';
import { REQUEST_LOGS_API } from '@shared/server-apis';
import {RequestLog} from '../models/request-log.model';
import { RequestLogService } from '../services/request-log.service';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { resourcePermissions } from '../utils/resource-permissions';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class RequestLogController {

  constructor(
    @service(RequestLogService)
    public requestLogService : RequestLogService,
  ) {}


  @authorize({resource: resourcePermissions.requestLogsView.name,
    ...adminAndUserAuthDetails})
  @get(`${REQUEST_LOGS_API}/count`)
  @response(200, {
    description: 'RequestLog model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestLog) where?: Where<RequestLog>,
  ): Promise<Count> {

    const count = await this.requestLogService.count(where);
    return count;

  }

  @authorize({resource: resourcePermissions.requestLogsView.name,
    ...adminAndUserAuthDetails})
  @get(REQUEST_LOGS_API)
  @response(200, {
    description: 'Array of RequestLog model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestLog, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestLog) filter?: Filter<RequestLog>,
  ): Promise<RequestLog[]> {

    const res = await this.requestLogService.find(filter);
    return res;

  }

  @authorize({resource: resourcePermissions.requestLogsView.name,
    ...adminAndUserAuthDetails})
  @get(`${REQUEST_LOGS_API}/{id}`)
  @response(200, {
    description: 'RequestLog model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestLog, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RequestLog, {exclude: 'where'}) filter?: FilterExcludingWhere<RequestLog>
  ): Promise<RequestLog> {

    const res = await this.requestLogService.findById(id, filter);
    return res;

  }

}
