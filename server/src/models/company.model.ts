import {Entity, model, property} from '@loopback/repository';
import { Company as CompanyIntf } from '@shared/entity/auth/company';
@model()
export class Company extends Entity implements CompanyIntf {

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
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  address: string;

  @property({
    type: 'string',

  })
  password: string;


  constructor(data?: Partial<Company>) {

    super(data);

  }

}

export interface CompanyRelations {
  // Describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
