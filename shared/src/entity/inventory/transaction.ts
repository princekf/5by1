import { Bank } from './bank';

export interface Transaction {
    fromAccount: Bank;
    toAccount: Bank;
    transactionDate: Date;
    note: string;
}
