import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Branch, BranchRelations, FinYear} from '../models';
import {FinYearRepository} from './fin-year.repository';

export class BranchRepository extends DefaultCrudRepository<
  Branch,
  typeof Branch.prototype.id,
  BranchRelations
> {

  public readonly defaultFinYear: BelongsToAccessor<FinYear, typeof Branch.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('FinYearRepository') protected finYearRepositoryGetter: Getter<FinYearRepository>,
  ) {
    super(Branch, dataSource);
    this.defaultFinYear = this.createBelongsToAccessorFor('defaultFinYear', finYearRepositoryGetter,);
    this.registerInclusionResolver('defaultFinYear', this.defaultFinYear.inclusionResolver);
  }
}
