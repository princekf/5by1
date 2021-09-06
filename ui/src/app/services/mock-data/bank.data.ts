import { Bank } from '@shared/entity/inventory/bank';


export const SBI:Bank = {
  id: 'bk-001',
  type: 'Bank',
  name: 'SBI',
  openingBalance: 3000,
  description: 'Indian Bank,TN',
};


export const HDFC:Bank = {
  id: 'bk-002',
  type: 'Cash',
  name: 'HDFC',
  openingBalance: 0,
  description: 'HDFC Kerala',

};

export const ICICI:Bank = {
  id: 'bk-003',
  type: 'Other',
  name: 'ICICI',
  openingBalance: 2000,
  description: 'SBI TVM',

};

