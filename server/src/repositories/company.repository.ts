import {inject} from '@loopback/core';
import {FboCommonMongoDataSource} from '../datasources';
import {Company, CompanyRelations} from '../models';
import { DefaultCrudRepository } from '@loopback/repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  constructor(
    @inject('datasources.FBOCommonMongo') dataSource: FboCommonMongoDataSource,
  ) {

    super(Company, dataSource);

  }

}
