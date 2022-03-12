import { Bank } from './bank';
export interface Transfer {
    id?: string;
    fromAccount?: Bank;
    toAccount?: Bank;
    fromAccountId?: string;
    toAccountId?: string;
    transferDate: Date;
    amount: number;
    description?: string;
}
