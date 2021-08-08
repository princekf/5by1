import { Unit } from './unit';

export interface Product {
    _id?: string;
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
