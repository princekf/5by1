import { Bank } from '@shared/entity/inventory/bank';


export const bank:Bank = {
  _id: 'bk-001',
  type: 'Bank',
  name: 'Indian Bank',
  openingBalance: 3000,
  description: 'Indian Bank,TN',
};


export const cash:Bank = {
  _id: 'bk-002',
  type: 'Cash',
  name: 'Balance',
  openingBalance: 0,
  description: 'HDFC Kerala',

};

export const Other:Bank = {
  _id: 'bk-003',
  type: 'Other',
  name: 'SBI',
  openingBalance: 2000,
  description: 'SBI TVM',

};

