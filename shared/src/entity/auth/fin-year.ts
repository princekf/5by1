import { Branch } from './branch';

export interface FinYear {
    id?: string;
    name?: string;
    code?: string;
    startDate?: Date;
    endDate?: Date;
    branch?: Branch;
    branchId?: string;
    [prop: string]: unknown;
}
