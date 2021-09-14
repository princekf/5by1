import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import {FbomongoDataSource} from '../datasources';
import {Tax, TaxRelations} from '../models';

export class TaxRepository extends FBOBaseRepository<
  Tax,
  typeof Tax.prototype.id,
  TaxRelations
> {


  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
  ) {

    super(Tax, dataSource);

  }

}
