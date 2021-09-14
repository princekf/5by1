import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import {FbomongoDataSource} from '../datasources';
import {Customer, CustomerRelations} from '../models';

export class CustomerRepository extends FBOBaseRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
  ) {

    super(Customer, dataSource);

  }

}
