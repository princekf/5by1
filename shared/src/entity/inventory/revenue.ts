import { Bank } from './bank';
import { Customer } from './customer';
import { Invoice } from './invoice';

export interface Revenue {
    id?:string;
    receivedDate: Date;
    customer?: Customer;
    customerId?: string;
    invoice?: Invoice;
    invoiceId?: string;
    bank?: Bank;
    bankId?: string;
    // Category like Sale etc
    category?: string;
    amount: number;
    description: string;
}
