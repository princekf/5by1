import { Invoice } from '@shared/entity/inventory/invoice';
import { basha, jomon } from '../mock-data/customer.data';
import { lnvDesktop1, hpDesktop1 } from '../mock-data/product.data';
import { noUnit } from '../mock-data/unit.data';

export const invoice1:Invoice = {
  id: '01231',
  customer: jomon,
  invoiceDate: new Date('2020-04-13'),
  dueDate: new Date('2020-04-13'),
  invoiceNumber: 'INV-001',
  totalAmount: 60000,
  totalDisount: 0,
  totalTax: 10800,
  roundOff: 0,
  grandTotal: 70800,
  isReceived: true,
  saleItems: [ {
    product: lnvDesktop1,
    unit: noUnit,
    unitPrice: 20000,
    quantity: 2,
    discount: 0,
    // Taxes: [ sgst9, cgst9 ],
    totalTax: 7200,
    totalAmount: 47200,
    batchNumber: 'batchnumber',
    mrp: 1300,
  },
  {
    product: hpDesktop1,
    unit: noUnit,
    unitPrice: 20000,
    quantity: 1,
    discount: 0,
    // Taxes: [ sgst9, cgst9 ],
    totalTax: 3600,
    totalAmount: 23600,
    batchNumber: 'batchnumber',
    mrp: 1300,
  } ]
};

export const invoice2:Invoice = {
  id: '01232',
  customer: basha,
  invoiceDate: new Date('2020-04-16'),
  dueDate: new Date('2020-04-16'),
  invoiceNumber: 'INV-002',
  totalAmount: 40000,
  totalDisount: 0,
  totalTax: 7200,
  roundOff: 0,
  grandTotal: 47200,
  isReceived: false,
  saleItems: [ {
    product: lnvDesktop1,
    unit: noUnit,
    unitPrice: 20000,
    quantity: 1,
    discount: 0,
    // Taxes: [ sgst9, cgst9 ],
    totalTax: 3600,
    totalAmount: 23600,
    batchNumber: 'batchnumber',
    mrp: 1300,
  },
  {
    product: hpDesktop1,
    unit: noUnit,
    unitPrice: 20000,
    quantity: 1,
    discount: 0,
    // Taxes: [ sgst9, cgst9 ],
    totalTax: 3600,
    totalAmount: 23600,
    batchNumber: 'batchnumber',
    mrp: 1300,
  } ]
};
