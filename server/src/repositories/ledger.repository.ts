import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Ledger, LedgerRelations, LedgerGroup} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';
import {LedgerGroupRepository} from './ledger-group.repository';

export class LedgerRepository extends DefaultCrudRepository<
  Ledger,
  typeof Ledger.prototype.id,
  LedgerRelations
> {

  public readonly ledgerGroup: BelongsToAccessor<LedgerGroup, typeof Ledger.prototype.id>;

  constructor(
    @repository.getter('LedgerGroupRepository') protected ledgerGroupRepositoryGetter: Getter<LedgerGroupRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Ledger, dsSessionFactory.createRunTimeDataSource(dbName));
    this.ledgerGroup = this.createBelongsToAccessorFor('ledgerGroup', ledgerGroupRepositoryGetter,);
    this.registerInclusionResolver('ledgerGroup', this.ledgerGroup.inclusionResolver);

  }

}
