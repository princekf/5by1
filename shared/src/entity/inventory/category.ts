import { Tax } from './tax';

interface CategoryTax {
    startDate: string;
    endDate: string;
    tax:Tax;
}

export interface Category {
    name: string;
    // Id of parent category
    parent?: string;
    // Products under one category may have more than one taxes
    taxRules?: Array<CategoryTax>
}
