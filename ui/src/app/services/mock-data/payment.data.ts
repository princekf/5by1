import {Payment } from '@shared/entity/inventory/payment';
import { kamala, kandk } from '../mock-data/vendor.data';
import { Other, bank, cash } from '../mock-data/bank.data';
import { bill1, bill2 } from '../mock-data/bill.data';


export const payment1:Payment = {

  _id: 'pymt-001',
  paidDate: new Date('2020-04-13'),
  vendor: kamala,
  bill: bill1,
  bank: Other,
  // Category like Purchase, Donation etc
  category: 'Purchase',
  amount: 10000,
  description: 'purchase payment reciept',
};

export const payment2:Payment = {

  _id: 'pymt-002',
  paidDate: new Date('2020-08-08'),
  vendor: kandk,
  bill: bill2,
  // eslint-disable-next-line object-shorthand
  bank: bank,
  // Category like Purchase, Donation etc
  category: 'Donation',
  amount: 2000,
  description: 'Donation payment reciept',
};


export const payment3:Payment = {

  _id: 'pymt-003',
  paidDate: new Date('2020-10-16'),
  vendor: kamala,
  bill: bill2,
  // eslint-disable-next-line object-shorthand
  bank: cash,
  // Category like Purchase, Donation etc
  category: 'Other payments',
  amount: 22000,
  description: 'Other payment reciept',
};
