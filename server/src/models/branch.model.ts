import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Branch as BranchIntf } from '@shared/entity/auth/branch';
import { FinYear } from './fin-year.model';

@model()
export class Branch extends Entity implements BranchIntf {

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
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  address: string;

  @property({
    type: 'date',
    required: true,
  })
  finYearStartDate: Date;

  defaultFinYear: FinYear;

  @belongsTo(() => FinYear)
  defaultFinYearId: string;

  constructor(data?: Partial<Branch>) {

    super(data);

  }

}

export interface BranchRelations {
  // Describe navigational properties here
}

export type BranchWithRelations = Branch & BranchRelations;
