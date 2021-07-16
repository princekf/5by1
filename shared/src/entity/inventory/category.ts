import { Tax } from './tax';

interface CategoryTax {
    startDate: string;
    endDate: string;
    tax:Tax;
}

export interface Category {
    name: string;
    // Parent category
    parent?: Category;
    // Products under one category may have more than one taxes
    taxRules?: Array<CategoryTax>
}
