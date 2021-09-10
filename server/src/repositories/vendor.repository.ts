import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Vendor, VendorRelations} from '../models';

export class VendorRepository extends DefaultCrudRepository<
  Vendor,
  typeof Vendor.prototype.id,
  VendorRelations
> {
  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
  ) {
    super(Vendor, dataSource);
  }
}
