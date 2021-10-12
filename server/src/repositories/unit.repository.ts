import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Unit, UnitRelations} from '../models';

export class UnitRepository extends DefaultCrudRepository<
  Unit,
  typeof Unit.prototype.id,
  UnitRelations
> {

  public readonly parent: BelongsToAccessor<Unit, typeof Unit.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
    @repository.getter('UnitRepository')
    protected unitRepositoryGetter: Getter<UnitRepository>,
  ) {

    super(Unit, dataSource);
    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this),);
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

  }

}
