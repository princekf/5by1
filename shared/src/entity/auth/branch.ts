import { FinYear } from './fin-year';

export interface Branch {
    id?: string;
    name?: string;
    code?: string;
    email?: string;
    address?: string;
    finYearStartDate?: Date;
    defaultFinYear?: FinYear;
    defaultFinYearId?: string;
}
