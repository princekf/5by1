import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Category, CategoryRelations, Unit} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';
import {UnitRepository} from './unit.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly unit: BelongsToAccessor<Unit, typeof Category.prototype.id>;

  public readonly parent: BelongsToAccessor<Category, typeof Category.prototype.id>;

  constructor(
    @repository.getter('UnitRepository')
    protected unitRepositoryGetter: Getter<UnitRepository>,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Category, dsSessionFactory.createRunTimeDataSource(dbName));
    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this),);
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);
    this.unit = this.createBelongsToAccessorFor('unit', unitRepositoryGetter,);
    this.registerInclusionResolver('unit', this.unit.inclusionResolver);

  }

}
