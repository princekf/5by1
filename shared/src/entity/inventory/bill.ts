import { Product } from './product';
import { Tax } from './tax';
import { Unit } from './unit';
import { Vendor } from './vendor';


export interface Tax {

    groupName: string;
    // Name like SGST - 9%, CGST - 9% etc
    name: string;
    // Tax rate like 5%, 9% etc
    rate: number;
    // Applied to - like 100% of total, 50% of total etc
    appliedTo: number;
    // Descriptions like : For other state customers, etc
    description?: string;

}
export interface PurchaseItem {
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
    items?: Array<PurchaseItem>;
    isPaid: boolean;
}
