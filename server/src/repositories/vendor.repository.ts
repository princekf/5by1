import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import {FbomongoDataSource} from '../datasources';
import {Vendor, VendorRelations} from '../models';

export class VendorRepository extends FBOBaseRepository<
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
