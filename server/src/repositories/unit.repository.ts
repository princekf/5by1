import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Unit, UnitRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class UnitRepository extends DefaultCrudRepository<
  Unit,
  typeof Unit.prototype.id,
  UnitRelations
> {

  public readonly parent: BelongsToAccessor<Unit, typeof Unit.prototype.id>;

  constructor(
    @repository.getter('UnitRepository')
    protected unitRepositoryGetter: Getter<UnitRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Unit, dsSessionFactory.createRunTimeDataSource(dbName));
    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this),);
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

  }

}
