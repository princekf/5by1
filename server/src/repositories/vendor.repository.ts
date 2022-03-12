import {inject} from '@loopback/core';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {Vendor, VendorRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class VendorRepository extends FBOBaseRepository<
  Vendor,
  typeof Vendor.prototype.id,
  VendorRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Vendor, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
