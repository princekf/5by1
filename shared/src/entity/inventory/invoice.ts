import { Customer } from './customer';
import { Product } from './product';
import { Tax } from './tax';
import { Unit } from './unit';

export interface SaleItem {
    product?: Product;
    productId?: string;
    unitPrice: number;
    unit?: Unit;
    unitId?: string;
    quantity: number;
    discount?: number;
    taxes?: Array<Tax>
    totalTax?: number;
    totalAmount: number;
    batchNumber?: string;
    mrp?: number;
}

export interface Invoice {
    id?: string;
    customer?: Customer;
    customerId?: string;
    invoiceDate: Date;
    dueDate?: Date;
    invoiceNumber?: string;
    totalAmount: number;
    totalDisount?: number;
    totalTax?: number;
    roundOff?: number;
    grandTotal: number;
    notes?: string;
    saleItems: Array<SaleItem>;
    isReceived?: boolean;
}
