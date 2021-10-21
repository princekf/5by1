import { Branch } from './branch';

export interface FinYear {
    id?: string;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    branch?: Branch;
    branchId?: string;
}
