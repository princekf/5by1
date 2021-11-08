import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {Bank, BankRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class BankRepository extends FBOBaseRepository<
  Bank,
  typeof Bank.prototype.id,
  BankRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Bank, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
