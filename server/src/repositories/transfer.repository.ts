import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import { FBOBaseRepository } from '.';
import {FbomongoDataSource} from '../datasources';
import {Transfer, TransferRelations, Bank} from '../models';
import {BankRepository} from './bank.repository';

export class TransferRepository extends FBOBaseRepository<
  Transfer,
  typeof Transfer.prototype.id,
  TransferRelations
> {

  public readonly fromAccount: BelongsToAccessor<Bank, typeof Transfer.prototype.id>;

  public readonly toAccount: BelongsToAccessor<Bank, typeof Transfer.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('BankRepository') protected bankRepositoryGetter: Getter<BankRepository>,
  ) {

    super(Transfer, dataSource);
    this.toAccount = this.createBelongsToAccessorFor('toAccount', bankRepositoryGetter,);
    this.registerInclusionResolver('toAccount', this.toAccount.inclusionResolver);
    this.fromAccount = this.createBelongsToAccessorFor('fromAccount', bankRepositoryGetter,);
    this.registerInclusionResolver('fromAccount', this.fromAccount.inclusionResolver);

  }

}
