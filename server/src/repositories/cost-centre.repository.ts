import {inject} from '@loopback/core';
import { FBOBaseRepository } from './fbo-base.repository';
import { BindingKeys } from '../binding.keys';
import {CostCentre, CostCentreRelations} from '../models/cost-centre.model';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class CostCentreRepository extends FBOBaseRepository<
  CostCentre,
  typeof CostCentre.prototype.id,
  CostCentreRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(CostCentre, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
