import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Ledger, LedgerRelations, LedgerGroup} from '../models';
import {LedgerGroupRepository} from './ledger-group.repository';

export class LedgerRepository extends DefaultCrudRepository<
  Ledger,
  typeof Ledger.prototype.id,
  LedgerRelations
> {

  public readonly ledgerGroup: BelongsToAccessor<LedgerGroup, typeof Ledger.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('LedgerGroupRepository') protected ledgerGroupRepositoryGetter: Getter<LedgerGroupRepository>,
  ) {
    super(Ledger, dataSource);
    this.ledgerGroup = this.createBelongsToAccessorFor('ledgerGroup', ledgerGroupRepositoryGetter,);
    this.registerInclusionResolver('ledgerGroup', this.ledgerGroup.inclusionResolver);
  }
}
