import { Bank } from './bank';
import { Bill } from './bill';
import { Vendor } from './vendor';

export interface Payment {
    paidDate: Date;
    vendor?: Vendor;
    bill?: Bill;
    bank?: Bank;
    // Category like Purchase, Donation etc
    category?: string;
    amount: number;
}
