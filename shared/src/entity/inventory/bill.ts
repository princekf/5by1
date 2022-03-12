import { Product } from './product';
import { Tax } from './tax';
import { Unit } from './unit';
import { Vendor } from './vendor';

export interface PurchaseItem {
    product?: Product;
    productId?: string;
    unitPrice: number;
    unit?: Unit;
    unitId?: string;
    quantity: number;
    discount?: number;
    taxes?: Array<Tax>
    totalTax: number;
    totalAmount: number;
    batchNumber?: string;
    expiryDate?: Date;
    mfgDate?: Date;
    mrp: number;
    // General retail price
    rrp: number;

}

export interface Bill {
    id?: string;
    vendor?: Vendor;
    vendorId?: string;
    billDate: Date;
    dueDate?: Date;
    billNumber: string;
    orderNumber?: string;
    orderDate?: Date;
    totalAmount: number;
    totalDiscount?: number;
    totalTax: number;
    roundOff?: number;
    grandTotal: number;
    notes?: string;
    purchaseItems?: Array<PurchaseItem>;
    isPaid: boolean;
}
