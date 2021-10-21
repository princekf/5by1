import { FinYear } from './fin-year';

export interface Branch {
    id?: string;
    name?: string;
    email?: string;
    address?: string;
    finYearStartDate?: Date;
    defaultFinYear?: FinYear;
}
