import { Bank } from './bank';
export interface Transfer {
    id?: string;
    fromAccount: Bank;
    toAccount: Bank;
    transferDate: Date;
    amount: number;
    description?: string;
}
