import { Entity, model, property, belongsTo} from '@loopback/repository';
import { Product as ProductIntf } from '@shared/entity/inventory/product';
import { Category } from './category.model';

@model()
export class Product extends Entity implements ProductIntf {

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
  code?: string;

  @property({
    type: 'string',
  })
  brand?: string;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'string',
  })
  barcode?: string;

  @property({
    type: 'number',
  })
  reorderLevel?: number;

  @property.array(String)
  colors?: string[];

  @property({
    type: 'boolean',
  })
  hasBatch?: boolean;

  @property({
    type: 'string',
  })
  status: 'Active' | 'Disabled' | 'Deleted';

  @property({
    type: 'string',
  })
  description?: string;

  category?: Category;

  @belongsTo(() => Category)
  categoryId: string;

  constructor(data?: Partial<Product>) {

    super(data);

  }

}

export interface ProductRelations {
  // Describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
