import {injectable, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { RequestLog } from '../models';
import { RequestLogRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class RequestLogService {

  constructor(@repository(RequestLogRepository)
  public requestLogRepository : RequestLogRepository,) {}


  create = async(requestLog: Omit<RequestLog, 'id'>,): Promise<RequestLog> => {

    const lgR = await this.requestLogRepository.create(requestLog);
    return lgR;

  }

}
