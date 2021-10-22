import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Voucher, VoucherRelations} from '../models';

export class VoucherRepository extends DefaultCrudRepository<
  Voucher,
  typeof Voucher.prototype.id,
  VoucherRelations
> {
  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
  ) {
    super(Voucher, dataSource);
  }
}
