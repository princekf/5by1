import { Bank } from './bank';

export interface Transfer {
    _id?: string;
    fromAccount: Bank;
    toAccount: Bank;
    transferDate: Date;
    amount: number;
    description?: string;
}
