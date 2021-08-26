import { Bank } from './bank';
import { Customer } from './customer';
import { Invoice } from './invoice';

export interface Revenue {
    receivedDate: Date;
    customer?: Customer;
    invoice?: Invoice;
    bank?: Bank;
    // Category like Sale etc
    category?: string;
    amount: number;
}