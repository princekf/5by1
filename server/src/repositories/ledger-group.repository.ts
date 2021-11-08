import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {LedgerGroup, LedgerGroupRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class LedgerGroupRepository extends DefaultCrudRepository<
  LedgerGroup,
  typeof LedgerGroup.prototype.id,
  LedgerGroupRelations
> {

  public readonly parent: BelongsToAccessor<LedgerGroup, typeof LedgerGroup.prototype.id>;

  constructor(
    @repository.getter('LedgerGroupRepository') protected ledgerGroupRepositoryGetter: Getter<LedgerGroupRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(LedgerGroup, dsSessionFactory.createRunTimeDataSource(dbName));
    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this),);
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

  }

}
