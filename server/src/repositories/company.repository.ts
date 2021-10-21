import {inject} from '@loopback/core';
import { FBOBaseRepository } from './fbo-base.repository';
import {FbomongoDataSource} from '../datasources';
import {Company, CompanyRelations} from '../models';

export class CompanyRepository extends FBOBaseRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource,
  ) {

    super(Company, dataSource);

  }

}
