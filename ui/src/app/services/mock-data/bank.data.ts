import { Bank } from '@shared/entity/inventory/bank';


export const bank:Bank = {
  type: 'Bank',
  name: 'Indian Bank',
  openingBalance: 3000,
  description: 'Indian Bank,TN',
};


export const cash:Bank = {
  type: 'Cash',
  name: 'Balance',
  openingBalance: 0,
  description: 'HDFC Kerala',

};

export const Other:Bank = {
  type: 'Other',
  name: 'SBI',
  openingBalance: 2000,
  description: 'SBI TVM',

};

