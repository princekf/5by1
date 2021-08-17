import { Customer } from './customer';
import { Product } from './product';
import { Tax } from './tax';
import { Unit } from './unit';

export interface SaleItem {
    product: Product;
    unitPrice: number;
    unit: Unit;
    quantity: number;
    discount: number;
    taxes: Array<Tax>
    totalTax: number;
    totalAmount: number;
    batchNumber?: string;
}

export interface Invoice {
    _id?: string;
    customer: Customer;
    invoiceDate: Date;
    dueDate: Date;
    invoiceNumber: string;
    totalAmount: number;
    totalDisount: number;
    totalTax: number;
    roundOff: number;
    grandTotal: number;
    notes?: string;
    items: Array<SaleItem>;
    isReceived: boolean;
}
