import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import {FbomongoDataSource} from '../datasources';
import {Bank, BankRelations} from '../models';

export class BankRepository extends FBOBaseRepository<
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
