import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Category, CategoryRelations, Unit} from '../models';
import {UnitRepository} from './unit.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly unit: BelongsToAccessor<Unit, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('UnitRepository') protected unitRepositoryGetter: Getter<UnitRepository>,
  ) {
    super(Category, dataSource);
    this.unit = this.createBelongsToAccessorFor('unit', unitRepositoryGetter,);
    this.registerInclusionResolver('unit', this.unit.inclusionResolver);
  }
}
