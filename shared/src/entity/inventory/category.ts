import { Tax } from './tax';

interface CategoryTax {
    startDate: string;
    endDate: string;
    tax:Tax;
}

export interface Category {
    _id?: string;
    name: string;
    // Parent category
    parent?: Category;
    // Products under one category may have more than one taxes
    taxRules?: Array<CategoryTax>;
    // Description of category
    description?: string;
}
