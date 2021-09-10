import { Entity, model, property } from '@loopback/repository';
import { Customer as CustomerIntf } from '@shared/entity/inventory/customer';

@model()
export class Customer extends Entity implements CustomerIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  mobile?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  gstNo?: string;


  constructor(data?: Partial<Customer>) {

    super(data);

  }

}

export interface CustomerRelations {
  // Describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
