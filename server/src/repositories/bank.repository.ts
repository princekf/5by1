import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Bank, BankRelations} from '../models';

export class BankRepository extends DefaultCrudRepository<
  Bank,
  typeof Bank.prototype.id,
  BankRelations
> {
  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
  ) {
    super(Bank, dataSource);
  }
}
