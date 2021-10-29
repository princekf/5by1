import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Bill, BillRelations, Vendor, PurchaseItem} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';
import {VendorRepository} from './vendor.repository';

export class BillRepository extends DefaultCrudRepository<
  Bill,
  typeof Bill.prototype.id,
  BillRelations
> {

  public readonly vendor: BelongsToAccessor<Vendor, typeof Bill.prototype.id>;

  public readonly purchaseItems: HasManyRepositoryFactory<PurchaseItem, typeof Bill.prototype.id>;

  constructor(
    @repository.getter('VendorRepository') protected vendorRepositoryGetter: Getter<VendorRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Bill, dsSessionFactory.createRunTimeDataSource(dbName));
    this.vendor = this.createBelongsToAccessorFor('vendor', vendorRepositoryGetter,);
    this.registerInclusionResolver('vendor', this.vendor.inclusionResolver);

  }

}
