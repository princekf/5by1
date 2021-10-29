import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {FinYear, FinYearRelations, Branch} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';
import {BranchRepository} from './branch.repository';

export class FinYearRepository extends DefaultCrudRepository<
  FinYear,
  typeof FinYear.prototype.id,
  FinYearRelations
> {

  public readonly branch: BelongsToAccessor<Branch, typeof FinYear.prototype.id>;

  constructor(
    @repository.getter('BranchRepository') protected branchRepositoryGetter: Getter<BranchRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(FinYear, dsSessionFactory.createRunTimeDataSource(dbName));
    this.branch = this.createBelongsToAccessorFor('branch', branchRepositoryGetter,);
    this.registerInclusionResolver('branch', this.branch.inclusionResolver);

  }

}
