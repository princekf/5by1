import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {FinYear, FinYearRelations, Branch} from '../models';
import {BranchRepository} from './branch.repository';

export class FinYearRepository extends DefaultCrudRepository<
  FinYear,
  typeof FinYear.prototype.id,
  FinYearRelations
> {

  public readonly branch: BelongsToAccessor<Branch, typeof FinYear.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('BranchRepository') protected branchRepositoryGetter: Getter<BranchRepository>,
  ) {
    super(FinYear, dataSource);
    this.branch = this.createBelongsToAccessorFor('branch', branchRepositoryGetter,);
    this.registerInclusionResolver('branch', this.branch.inclusionResolver);
  }
}
