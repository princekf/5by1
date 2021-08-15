import { Account } from './account';
import { Customer } from './customer';
import { Invoice } from './invoice';

export interface Revenue {
    receivedDate: Date;
    customer?: Customer;
    invoice?: Invoice;
    account?: Account;
    // Category like Sale etc
    category?: string;
    amount: number;
}
