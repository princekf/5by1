import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Voucher, VoucherRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class VoucherRepository extends DefaultCrudRepository<
  Voucher,
  typeof Voucher.prototype.id,
  VoucherRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Voucher, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
