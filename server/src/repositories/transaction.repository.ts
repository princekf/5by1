import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Transaction, TransactionRelations, Ledger, CostCentre} from '../models';
import {LedgerRepository} from './ledger.repository';
import {CostCentreRepository} from './cost-centre.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly ledger: BelongsToAccessor<Ledger, typeof Transaction.prototype.id>;

  public readonly costCentre: BelongsToAccessor<CostCentre, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>, @repository.getter('CostCentreRepository') protected costCentreRepositoryGetter: Getter<CostCentreRepository>,
  ) {
    super(Transaction, dataSource);
    this.costCentre = this.createBelongsToAccessorFor('costCentre', costCentreRepositoryGetter,);
    this.registerInclusionResolver('costCentre', this.costCentre.inclusionResolver);
    this.ledger = this.createBelongsToAccessorFor('ledger', ledgerRepositoryGetter,);
    this.registerInclusionResolver('ledger', this.ledger.inclusionResolver);
  }
}
