import { Transaction } from './transaction';

export enum VoucherType {
    SALES = 'Sales',
    PURCHASE = 'Purchase',
    PAYMENT = 'Payment',
    RECEIPT = 'Receipt',
    CONTRA = 'Contra',
    JOURNAL = 'Journal',
    CREDIT_NOTE = 'Credit Note',
    DEBIT_NOTE = 'Debit Note'
}

export interface Voucher {
    id?: string;
    number?: string;
    date?: Date;
    type?: VoucherType;
    details?: string;
    transactions?: Array<Transaction>
}
