import {Entity, model, property} from '@loopback/repository';

@model()
export class Company extends Entity {

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
