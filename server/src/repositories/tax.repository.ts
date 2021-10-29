import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {Tax, TaxRelations} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';

export class TaxRepository extends FBOBaseRepository<
  Tax,
  typeof Tax.prototype.id,
  TaxRelations
> {


  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Tax, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
