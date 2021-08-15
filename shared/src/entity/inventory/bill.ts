import { Product } from './product';
import { Tax } from './tax';
import { Unit } from './unit';
import { Vendor } from './vendor';

interface PurchaseItem {
    product: Product;
    unitPrice: number;
    unit: Unit;
    quantity: number;
    discount: number;
    taxes: Array<Tax>
    totalTax: number;
    totalAmount: number;
    batchNumber?: string;
    expiryDate?: Date;
    mfgDate?: Date;
    mrp: number;
}

export interface Bill {
    _id?: string;
    vendor: Vendor;
    billDate: Date;
    dueDate: Date;
    billNumber: string;
    orderNumber?: string;
    orderDate?: Date;
    totalAmount: number;
    totalDisount: number;
    totalTax: number;
    roundOff: number;
    grandTotal: number;
    notes?: string;
    items: Array<PurchaseItem>;
    isPaid: boolean;
}
