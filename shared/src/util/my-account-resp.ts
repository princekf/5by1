import { Branch } from '../entity/auth/branch';
import { Company } from '../entity/auth/company';
import { FinYear } from '../entity/auth/fin-year';
import { User } from '../entity/auth/user';
import { ProfileUser } from './profile-user';

export interface MyAccountResp {
    sessionUser: ProfileUser;
    user: User;
    company: Company | null;
    branches: Array<Branch>;
    finYears:Array<FinYear>
  }
