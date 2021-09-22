import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {PurchaseItemTax, PurchaseItemTaxRelations, PurchaseItem, Tax} from '../models';
import {PurchaseItemRepository} from './purchase-item.repository';
import {TaxRepository} from './tax.repository';

export class PurchaseItemTaxRepository extends DefaultCrudRepository<
  PurchaseItemTax,
  typeof PurchaseItemTax.prototype.id,
  PurchaseItemTaxRelations
> {

  public readonly purchaseItem: BelongsToAccessor<PurchaseItem, typeof PurchaseItemTax.prototype.id>;

  public readonly tax: BelongsToAccessor<Tax, typeof PurchaseItemTax.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('PurchaseItemRepository') protected purchaseItemRepositoryGetter: Getter<PurchaseItemRepository>, @repository.getter('TaxRepository') protected taxRepositoryGetter: Getter<TaxRepository>,
  ) {
    super(PurchaseItemTax, dataSource);
    this.tax = this.createBelongsToAccessorFor('tax', taxRepositoryGetter,);
    this.registerInclusionResolver('tax', this.tax.inclusionResolver);
    this.purchaseItem = this.createBelongsToAccessorFor('purchaseItem', purchaseItemRepositoryGetter,);
    this.registerInclusionResolver('purchaseItem', this.purchaseItem.inclusionResolver);
  }
}
