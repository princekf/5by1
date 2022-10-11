import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FboCommonMongoDataSource} from '../datasources';
import {SignupLog, SignupLogRelations} from '../models';

export class SignupLogRepository extends DefaultCrudRepository<
  SignupLog,
  typeof SignupLog.prototype.id,
  SignupLogRelations
> {
  constructor(
    @inject('datasources.FBOCommonMongo') dataSource: FboCommonMongoDataSource,
  ) {
    super(SignupLog, dataSource);
  }
}
