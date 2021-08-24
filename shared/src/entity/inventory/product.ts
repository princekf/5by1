import { Category } from './category';

export interface Product {
    _id?: string;
    name: string;
    code?: string;
    // Brand like Samsung, Sony etc
    brand?: string;
    // Location of product in the store, like Rack-1 etc
    location?: string;
    barcode?: string;
    reorderLevel?: number;
    colors?: string[];
    // Enforce batch name and expiry date while entering purchase
    hasBatch?: boolean;
    status: 'Active' | 'Disabled' | 'Deleted';
    description?: string;
    category?:Category;
}
