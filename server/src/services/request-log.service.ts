import {injectable, BindingScope} from '@loopback/core';
import { Count, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { RequestLog } from '../models/request-log.model';
import { RequestLogRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class RequestLogService {

  constructor(@repository(RequestLogRepository)
  public requestLogRepository : RequestLogRepository,) {}


  create = async(requestLog: Omit<RequestLog, 'id'>,): Promise<RequestLog> => {

    const lgR = await this.requestLogRepository.create(requestLog);
    return lgR;

  }

  count = async(where?: Where<RequestLog>): Promise<Count> => {

    const count = await this.requestLogRepository.count(where);
    return count;

  }

  find = async(filter?: Filter<RequestLog>): Promise<RequestLog[]> => {

    const res = this.requestLogRepository.find(filter);
    return res;

  }

  findById = async(id: string, filter?: FilterExcludingWhere<RequestLog>): Promise<RequestLog> => {

    const res = this.requestLogRepository.findById(id, filter);
    return res;

  }

}
