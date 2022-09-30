import { Permission } from '../entity/auth/user';

const CURD_OPERATIONS = {
  view: true,
  create: true,
  update: true,
  delete: true,
};
export const permissions:Record<string, Permission> = {
  'branch': {
    key: 'branch',
    name: 'Branch',
    operations: {...CURD_OPERATIONS}
  },
  'finyear': {
    key: 'finyear',
    name: 'Financial Year',
    operations: {...CURD_OPERATIONS}
  },
  'user': {
    key: 'user',
    name: 'User',
    operations: {...CURD_OPERATIONS}
  },
  'unit': {
    key: 'unit',
    name: 'Unit',
    operations: {...CURD_OPERATIONS}
  },
  'tax': {
    key: 'tax',
    name: 'Tax',
    operations: {...CURD_OPERATIONS}
  },
  'category': {
    key: 'category',
    name: 'Product Category',
    operations: {...CURD_OPERATIONS}
  },
  'product': {
    key: 'product',
    name: 'Product',
    operations: {...CURD_OPERATIONS}
  },
  'invoice': {
    key: 'invoice',
    name: 'Invoice',
    operations: {...CURD_OPERATIONS}
  },
  'stock': {
    key: 'stock',
    name: 'Stock',
    operations: {...CURD_OPERATIONS}
  },
  'revenue': {
    key: 'revenue',
    name: 'Revenue',
    operations: {...CURD_OPERATIONS}
  },
  'customer': {
    key: 'customer',
    name: 'Customer',
    operations: {...CURD_OPERATIONS}
  },
  'bill': {
    key: 'bill',
    name: 'Bill',
    operations: {...CURD_OPERATIONS}
  },
  'payment': {
    key: 'payment',
    name: 'Payment',
    operations: {...CURD_OPERATIONS}
  },
  'vendor': {
    key: 'vendor',
    name: 'Vendor',
    operations: {...CURD_OPERATIONS}
  },
  'bank': {
    key: 'bank',
    name: 'Bank',
    operations: {...CURD_OPERATIONS}
  },
  'transfer': {
    key: 'transfer',
    name: 'Bank Transfer',
    operations: {...CURD_OPERATIONS}
  },
  'ledgergroup': {
    key: 'ledgergroup',
    name: 'Ledger Group',
    operations: {...CURD_OPERATIONS}
  },
  'ledger': {
    key: 'ledger',
    name: 'Ledger',
    operations: {...CURD_OPERATIONS}
  },
  'voucher': {
    key: 'voucher',
    name: 'Voucher',
    operations: {...CURD_OPERATIONS}
  },
  'costcentre': {
    key: 'costcentre',
    name: 'Cost Centres',
    operations: {...CURD_OPERATIONS}
  },
  'reqlogs': {
    key: 'reqlogs',
    name: 'Request Logs',
    operations: {view: true}
  }
};
