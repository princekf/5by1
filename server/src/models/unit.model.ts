import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Unit as UnitIntf } from '@shared/entity/inventory/unit';

@model()
export class Unit extends Entity implements UnitIntf {

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
  name: string;

  @property({
    type: 'string',
  })
  code: string;

  parent?: Unit;

  @property({
    type: 'number',
  })
  times?: number;

  @property({
    type: 'number',
  })
  decimalPlaces: number;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Unit)
  parentId: string;

  constructor(data?: Partial<Unit>) {

    super(data);

  }

}

export interface UnitRelations {
  // Describe navigational properties here
}

export type UnitWithRelations = Unit & UnitRelations;
