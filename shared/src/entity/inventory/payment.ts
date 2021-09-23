import { Bank } from './bank';
import { Bill } from './bill';
import { Vendor } from './vendor';

export interface Payment {

    id?:string;
    paidDate: Date;
    vendor?: Vendor;
    vendorId?: string;
    bill?: Bill;
    billId?: string;
    bank?: Bank;
    bankId?: string;
    // Category like Purchase, Donation etc
    category?: string;
    amount: number;
    description?: string;
}
