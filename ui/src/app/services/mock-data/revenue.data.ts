import { Revenue} from '@shared/entity/inventory/revenue';
import { basha, jomon, pavithran} from '../mock-data/customer.data';
import {invoice1, invoice2} from '../mock-data/invoice.data';
import { HDFC, ICICI, SBI} from '../mock-data/bank.data';

export const Revenue1:Revenue = {
  id: 'rve-001',
  receivedDate: new Date('2020-04-13'),
  customer: basha,
  invoice: invoice1,
  bank: HDFC,
  category: 'sales',
  amount: 1000,
  description: 'revenue report from basha-invoice1',

};

export const Revenue2:Revenue = {
  id: 'rve-002',
  receivedDate: new Date('2021-04-23'),
  customer: jomon,
  invoice: invoice2,
  // eslint-disable-next-line object-shorthand
  bank: ICICI,
  category: 'Purchase',
  amount: 1000,
  description: 'revenue report from jomon-invoice2',

};


export const Revenue3:Revenue = {
  id: 'rve-003',
  receivedDate: new Date('2021-08-18'),
  customer: pavithran,
  invoice: invoice2,
  bank: SBI,
  category: 'Expenses',
  amount: 1000,
  description: 'revenue report from pavithran-invoice2',

};

