import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {SaleItem, SaleItemRelations, Product, Unit} from '../models';
import {ProductRepository} from './product.repository';
import {UnitRepository} from './unit.repository';

export class SaleItemRepository extends DefaultCrudRepository<
  SaleItem,
  typeof SaleItem.prototype.id,
  SaleItemRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof SaleItem.prototype.id>;

  public readonly unit: BelongsToAccessor<Unit, typeof SaleItem.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('UnitRepository') protected unitRepositoryGetter: Getter<UnitRepository>,
  ) {
    super(SaleItem, dataSource);
    this.unit = this.createBelongsToAccessorFor('unit', unitRepositoryGetter,);
    this.registerInclusionResolver('unit', this.unit.inclusionResolver);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
