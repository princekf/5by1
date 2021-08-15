import { Account } from './account';

export interface Transaction {
    fromAccount: Account;
    toAccount: Account;
    transactionDate: Date;
    note: string;
}
