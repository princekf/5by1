import { Unit } from './unit';

export interface Category {
    id?: string;
    name: string;
    hsnNumber?: string;
    unit?: Unit;
    unitId?: string;
    // Parent category
    parent?: Category;
    parentId?: string;
    // Description of category
    description?: string;
}
