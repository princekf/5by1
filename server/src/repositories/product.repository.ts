import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {Product, ProductRelations, Category} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';
import {CategoryRepository} from './category.repository';

export class ProductRepository extends FBOBaseRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;

  constructor(
    @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Product, dsSessionFactory.createRunTimeDataSource(dbName));
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);

  }

}
