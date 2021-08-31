import {Bill } from '@shared/entity/inventory/bill';
import { kamala, kandk } from '../mock-data/vendor.data';
import { lnvDesktop1, hpDesktop1 } from '../mock-data/product.data';
import { noUnit } from '../mock-data/unit.data';
import { sgst9, cgst9 } from '../mock-data/tax.data';


export const bill1:Bill = {

  _id: 'bil-001',
  vendor: kamala,
  billDate: new Date('2020-04-23'),
  dueDate: new Date('2021-04-13'),
  billNumber: 'bil-001',
  orderNumber: 'order-098',
  orderDate: new Date('2020-01-03'),
  totalAmount: 20,
  totalDisount: 5,
  totalTax: 3,
  roundOff: 1158,
  grandTotal: 18,
  notes: 'bill for vendor Kamala',
  items: [ {
    product: lnvDesktop1,
    unit: noUnit,
    unitPrice: 20000,
    quantity: 2,
    discount: 0,
    taxes: [ sgst9, cgst9 ],
    totalTax: 7200,
    totalAmount: 47200,
    batchNumber: 'batchnumber',
    expiryDate: new Date('2020-04-23'),
    mfgDate: new Date('2019-04-23'),
    mrp: 1300
  } ],
  isPaid: true,

};


export const bill2:Bill = {

  _id: 'bil-002',
  vendor: kandk,
  billDate: new Date('2020-04-23'),
  dueDate: new Date('2021-04-13'),
  billNumber: 'bil-002',
  orderNumber: 'order-098',
  orderDate: new Date('2020-01-03'),
  totalAmount: 20,
  totalDisount: 5,
  totalTax: 3,
  roundOff: 1158,
  grandTotal: 18,
  notes: 'bill for vendor Kamala',
  items: [ {
    product: hpDesktop1,
    unit: noUnit,
    unitPrice: 20000,
    quantity: 2,
    discount: 0,
    taxes: [ sgst9, cgst9 ],
    totalTax: 7200,
    totalAmount: 47200,
    batchNumber: 'batchnumber',
    expiryDate: new Date('2020-04-23'),
    mfgDate: new Date('2019-04-23'),
    mrp: 1300
  } ],
  isPaid: false,

};
