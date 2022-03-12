import { Entity, model, property } from '@loopback/repository';
import { Tax as Taxinft } from '@shared/entity/inventory/tax';

@model()
export class Tax extends Entity implements Taxinft {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
  })
  groupName: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'number',
  })
  rate: number;

  @property({
    type: 'number',
  })
  appliedTo: number;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<Tax>) {

    super(data);

  }

}

export interface TaxRelations {
  // Describe navigational properties here
}

export type TaxWithRelations = Tax & TaxRelations;
