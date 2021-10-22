import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {LedgerGroup, LedgerGroupRelations} from '../models';

export class LedgerGroupRepository extends DefaultCrudRepository<
  LedgerGroup,
  typeof LedgerGroup.prototype.id,
  LedgerGroupRelations
> {

  public readonly parent: BelongsToAccessor<LedgerGroup, typeof LedgerGroup.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
    @repository.getter('LedgerGroupRepository') protected ledgerGroupRepositoryGetter: Getter<LedgerGroupRepository>,
  ) {

    super(LedgerGroup, dataSource);
    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this),);
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

  }

}
