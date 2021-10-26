import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {UserCredentials, UserCredentialsRelations} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(UserCredentials, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
