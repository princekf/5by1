import { Permission } from '../entity/auth/user';

const CURD_OPERATIONS = {
  list: true,
  view: true,
  create: true,
  update: true,
  delete: true,
};
export const permissions:Array<Permission> = [
  {
    key: 'branch',
    name: 'Branch',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'finyear',
    name: 'Financial Year',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'unit',
    name: 'Unit',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'tax',
    name: 'Tax',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'category',
    name: 'Product Category',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'product',
    name: 'Product',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'invoice',
    name: 'Invoice',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'revenue',
    name: 'Revenue',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'customer',
    name: 'Customer',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'bill',
    name: 'Bill',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'payment',
    name: 'Payment',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'vendor',
    name: 'Vendor',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'bank',
    name: 'Bank',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'transfer',
    name: 'Bank Transfer',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'ledgergroup',
    name: 'Ledger Group',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'ledger',
    name: 'Ledger',
    operations: {...CURD_OPERATIONS}
  },
  {
    key: 'voucher',
    name: 'Voucher',
    operations: {...CURD_OPERATIONS}
  },
];
