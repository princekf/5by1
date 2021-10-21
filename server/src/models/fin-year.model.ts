import {Entity, model, property, belongsTo} from '@loopback/repository';
import { FinYear as FinYearIntf } from '@shared/entity/auth/fin-year';
import { Branch } from './branch.model';

@model()
export class FinYear extends Entity implements FinYearIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  startDate: Date;

  @property({
    type: 'date',
    required: true,
  })
  endDate: Date;

  branch: Branch;

  @belongsTo(() => Branch)
  branchId: string;

  constructor(data?: Partial<FinYear>) {

    super(data);

  }

}

export interface FinYearRelations {
  // Describe navigational properties here
}

export type FinYearWithRelations = FinYear & FinYearRelations;
