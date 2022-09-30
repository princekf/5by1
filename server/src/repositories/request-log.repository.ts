import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {RequestLog, RequestLogRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class RequestLogRepository extends DefaultCrudRepository<
  RequestLog,
  typeof RequestLog.prototype.id,
  RequestLogRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_COMPANY_CODE) dbName: string
  ) {

    super(RequestLog, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
