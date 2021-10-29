import {inject, Getter} from '@loopback/core';
import { repository, BelongsToAccessor} from '@loopback/repository';
import {Payment, PaymentRelations, Vendor, Bank, Bill} from '../models';
import {VendorRepository} from './vendor.repository';
import {BankRepository} from './bank.repository';
import {BillRepository} from './bill.repository';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import { dsSessionFactory } from '../services/data-source-session-factory';

export class PaymentRepository extends FBOBaseRepository<
  Payment,
  typeof Payment.prototype.id,
  PaymentRelations
> {

  public readonly vendor: BelongsToAccessor<Vendor, typeof Payment.prototype.id>;

  public readonly bank: BelongsToAccessor<Bank, typeof Payment.prototype.id>;

  public readonly bill: BelongsToAccessor<Bill, typeof Payment.prototype.id>;

  constructor(
    @repository.getter('VendorRepository') protected vendorRepositoryGetter: Getter<VendorRepository>,
    @repository.getter('BankRepository') protected bankRepositoryGetter: Getter<BankRepository>,
    @repository.getter('BillRepository') protected billRepositoryGetter: Getter<BillRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Payment, dsSessionFactory.createRunTimeDataSource(dbName));
    this.bill = this.createBelongsToAccessorFor('bill', billRepositoryGetter,);
    this.registerInclusionResolver('bill', this.bill.inclusionResolver);
    this.bank = this.createBelongsToAccessorFor('bank', bankRepositoryGetter,);
    this.registerInclusionResolver('bank', this.bank.inclusionResolver);
    this.vendor = this.createBelongsToAccessorFor('vendor', vendorRepositoryGetter,);
    this.registerInclusionResolver('vendor', this.vendor.inclusionResolver);

  }

}
