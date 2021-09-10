import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Tax, TaxRelations} from '../models';

export class TaxRepository extends DefaultCrudRepository<
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
