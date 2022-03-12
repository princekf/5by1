import { Branch } from '../entity/auth/branch';
import { Company } from '../entity/auth/company';
import { FinYear } from '../entity/auth/fin-year';
import { User } from '../entity/auth/user';

export interface SessionUser {
    user:User;
    company?: Company | null;
    branch?: Branch | null;
    finYear?: FinYear | null;
}
