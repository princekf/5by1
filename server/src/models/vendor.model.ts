import {Entity, model, property} from '@loopback/repository';
import { Vendor as VendorIntf } from '@shared/entity/inventory/vendor';

@model()
export class Vendor extends Entity implements VendorIntf {

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

  constructor(data?: Partial<Vendor>) {

    super(data);

  }

}

export interface VendorRelations {
  // Describe navigational properties here
}

export type VendorWithRelations = Vendor & VendorRelations;
