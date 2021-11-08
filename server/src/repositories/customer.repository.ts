import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {Customer, CustomerRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class CustomerRepository extends FBOBaseRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Customer, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
