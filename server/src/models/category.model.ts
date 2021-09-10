import { Entity, model, property, belongsTo} from '@loopback/repository';
import { Category as CategoryIntf } from '@shared/entity/inventory/category';
import { Unit } from './unit.model';

@model()
export class Category extends Entity implements CategoryIntf {

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
  hsnNumber?: string;

  unit: Unit;

  @property({
    type: 'string',
  })
  parent?: Category;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Unit)
  unitId: string;

  constructor(data?: Partial<Category>) {

    super(data);

  }

}

export interface CategoryRelations {
  // Describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
