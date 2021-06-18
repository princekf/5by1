import { Unit } from './unit';

export interface ProductS {
    name: string;
    code?: string;
    brand?: string;
    location?: string;
    barcode?: string;
    unit: Unit;
    reorderLevel?: number;
    colors?: string[];
    hasBatch?: boolean;
    status: 'Active' | 'Disabled' | 'Deleted';
}
export interface Product extends ProductS {
    _id?: string;
}
