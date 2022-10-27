import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Transaction, TransactionRelations, Ledger, } from '../models';
import {LedgerRepository} from './ledger.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly ledger: BelongsToAccessor<Ledger, typeof Transaction.prototype.id>;


  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>,
  ) {

    super(Transaction, dataSource);
    this.ledger = this.createBelongsToAccessorFor('ledger', ledgerRepositoryGetter,);
    this.registerInclusionResolver('ledger', this.ledger.inclusionResolver);

  }

}
