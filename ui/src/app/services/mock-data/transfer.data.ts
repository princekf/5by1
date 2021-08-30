import { Transfer} from '@shared/entity/inventory/transfer';
import { HDFC, ICICI, SBI } from '../mock-data/bank.data';

export const transfer1:Transfer = {

  _id: 'tfr-001',
  fromAccount: HDFC,
  toAccount: ICICI,
  transferDate: new Date('2021-04-13'),
  amount: 10000,
  description: 'transaction between HDFC to ICICI',
};

export const transfer2:Transfer = {

  _id: 'tfr-002',
  fromAccount: SBI,
  toAccount: HDFC,
  transferDate: new Date('2021-24-13'),
  amount: 25000,
  description: 'transaction between SBI to HDFC',
};


export const transfer3:Transfer = {

  _id: 'tfr-003',
  fromAccount: ICICI,
  toAccount: HDFC,
  transferDate: new Date('2020-11-23'),
  amount: 32000,
  description: 'transaction between ICICI to HDFC',
};
