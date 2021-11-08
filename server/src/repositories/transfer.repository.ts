import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {Transfer, TransferRelations, Bank} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';
import {BankRepository} from './bank.repository';

export class TransferRepository extends FBOBaseRepository<
  Transfer,
  typeof Transfer.prototype.id,
  TransferRelations
> {

  public readonly fromAccount: BelongsToAccessor<Bank, typeof Transfer.prototype.id>;

  public readonly toAccount: BelongsToAccessor<Bank, typeof Transfer.prototype.id>;

  constructor(
    @repository.getter('BankRepository') protected bankRepositoryGetter: Getter<BankRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Transfer, dsSessionFactory.createRunTimeDataSource(dbName));
    this.toAccount = this.createBelongsToAccessorFor('toAccount', bankRepositoryGetter,);
    this.registerInclusionResolver('toAccount', this.toAccount.inclusionResolver);
    this.fromAccount = this.createBelongsToAccessorFor('fromAccount', bankRepositoryGetter,);
    this.registerInclusionResolver('fromAccount', this.fromAccount.inclusionResolver);

  }

}
