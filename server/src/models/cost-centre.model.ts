import {Entity, model, property} from '@loopback/repository';
import { CostCentre as CostCentreIntf } from '@shared/entity/accounting/cost-centre';

@model()
export class CostCentre extends Entity implements CostCentreIntf {

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
  details: string;

  constructor(data?: Partial<CostCentre>) {

    super(data);

  }

}

export interface CostCentreRelations {
  // Describe navigational properties here
}

export type CostCentreWithRelations = CostCentre & CostCentreRelations;
