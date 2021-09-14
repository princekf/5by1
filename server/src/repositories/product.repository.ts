import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import { FBOBaseRepository } from '.';
import {FbomongoDataSource} from '../datasources';
import {Product, ProductRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class ProductRepository extends FBOBaseRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {

    super(Product, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);

  }

}
