import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Branch, BranchRelations, FinYear} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';
import {FinYearRepository} from './fin-year.repository';

export class BranchRepository extends DefaultCrudRepository<
  Branch,
  typeof Branch.prototype.id,
  BranchRelations
> {

  public readonly defaultFinYear: BelongsToAccessor<FinYear, typeof Branch.prototype.id>;

  constructor(
    @repository.getter('FinYearRepository') protected finYearRepositoryGetter: Getter<FinYearRepository>,
    @inject(BindingKeys.SESSION_COMPANY_CODE) dbName: string
  ) {

    super(Branch, dsSessionFactory.createRunTimeDataSource(dbName));
    this.defaultFinYear = this.createBelongsToAccessorFor('defaultFinYear', finYearRepositoryGetter,);
    this.registerInclusionResolver('defaultFinYear', this.defaultFinYear.inclusionResolver);

  }

}
