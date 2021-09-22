import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {PurchaseItem, PurchaseItemRelations, Product, Unit, Tax, PurchaseItemTax} from '../models';
import {ProductRepository} from './product.repository';
import {UnitRepository} from './unit.repository';
import {PurchaseItemTaxRepository} from './purchase-item-tax.repository';
import {TaxRepository} from './tax.repository';

export class PurchaseItemRepository extends DefaultCrudRepository<
  PurchaseItem,
  typeof PurchaseItem.prototype.id,
  PurchaseItemRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof PurchaseItem.prototype.id>;

  public readonly unit: BelongsToAccessor<Unit, typeof PurchaseItem.prototype.id>;

  public readonly taxes: HasManyThroughRepositoryFactory<Tax, typeof Tax.prototype.id,
          PurchaseItemTax,
          typeof PurchaseItem.prototype.id
        >;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('UnitRepository') protected unitRepositoryGetter: Getter<UnitRepository>, @repository.getter('PurchaseItemTaxRepository') protected purchaseItemTaxRepositoryGetter: Getter<PurchaseItemTaxRepository>, @repository.getter('TaxRepository') protected taxRepositoryGetter: Getter<TaxRepository>,
  ) {
    super(PurchaseItem, dataSource);
    this.taxes = this.createHasManyThroughRepositoryFactoryFor('taxes', taxRepositoryGetter, purchaseItemTaxRepositoryGetter,);
    this.registerInclusionResolver('taxes', this.taxes.inclusionResolver);
    this.unit = this.createBelongsToAccessorFor('unit', unitRepositoryGetter,);
    this.registerInclusionResolver('unit', this.unit.inclusionResolver);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
