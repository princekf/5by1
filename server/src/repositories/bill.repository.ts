import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Bill, BillRelations, Vendor, PurchaseItem} from '../models';
import {VendorRepository} from './vendor.repository';
import {PurchaseItemRepository} from './purchase-item.repository';

export class BillRepository extends DefaultCrudRepository<
  Bill,
  typeof Bill.prototype.id,
  BillRelations
> {

  public readonly vendor: BelongsToAccessor<Vendor, typeof Bill.prototype.id>;

  public readonly purchaseItems: HasManyRepositoryFactory<PurchaseItem, typeof Bill.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('VendorRepository') protected vendorRepositoryGetter: Getter<VendorRepository>, @repository.getter('PurchaseItemRepository') protected purchaseItemRepositoryGetter: Getter<PurchaseItemRepository>,
  ) {

    super(Bill, dataSource);
    this.vendor = this.createBelongsToAccessorFor('vendor', vendorRepositoryGetter,);
    this.registerInclusionResolver('vendor', this.vendor.inclusionResolver);

  }

}
