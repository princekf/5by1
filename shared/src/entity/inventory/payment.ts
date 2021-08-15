import { Account } from './account';
import { Bill } from './bill';
import { Vendor } from './vendor';

export interface Payment {
    paidDate: Date;
    vendor?: Vendor;
    bill?: Bill;
    account?: Account;
    // Category like Purchase, Donation etc
    category?: string;
    amount: number;
}
