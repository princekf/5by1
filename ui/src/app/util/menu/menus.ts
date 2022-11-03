import { LOCAL_USER_KEY } from '@fboutil/constants';
import { MenuNode } from '@fboutil/menu/menu-node';
import { Permission } from '@shared/entity/auth/user';
import { SessionUser } from '@shared/util/session-user';

const menus: MenuNode[] = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    icon: 'space_dashboard',
    pKey: 'dashboard',
  },
  {path: 'item',
    name: 'Item',
    icon: 'layers',
    children: [
      {path: 'unit',
        name: 'Units',
        pKey: 'unit'},
      {path: 'tax',
        name: 'Taxes',
        pKey: 'tax'},
      {path: 'category',
        name: 'Categories',
        pKey: 'category'},
      {path: 'product',
        name: 'Products',
        pKey: 'product'},
      {path: 'bank',
        name: 'Banks',
        pKey: 'bank'},
    ]},
  {
    path: 'sale',
    name: 'Sale',
    icon: 'paid',
    children: [
      {path: 'invoice',
        name: 'Invoices',
        pKey: 'invoice'},
      {path: 'revenue',
        name: 'Revenues',
        pKey: 'revenue'},
      {path: 'customer',
        name: 'Customers',
        pKey: 'customer'},
    ]
  },
  {path: 'purchase',
    name: 'Purchases',
    icon: 'shopping_cart',
    children: [
      {path: 'bill',
        name: 'Bills',
        pKey: 'bill'},
      {path: 'payment',
        name: 'Payments',
        pKey: 'payment'},
      {path: 'vendor',
        name: 'Vendors',
        pKey: 'vendor'},
    ]},
  {path: 'accounts',
    name: 'Accounts',
    icon: 'business_center',
    children: [
      {path: 'ledgerGroup',
        name: 'Ledger Group',
        pKey: 'ledgergroup'},
      {path: 'ledger',
        name: 'Ledger',
        pKey: 'ledger'},
    ] },
  {path: 'voucher',
    name: 'Voucher',
    icon: 'receipt_long',
    children: [
      {path: 'voucher/sales',
        name: 'Sales',
        pKey: 'voucher'},
      {path: 'voucher/sales/create',
        name: 'Create Sales',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/purchase',
        name: 'Purchase',
        pKey: 'voucher'},
      {path: 'voucher/purchase/create',
        name: 'Create Purchase',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/payment',
        name: 'Payment',
        pKey: 'voucher'},
      {path: 'voucher/payment/create',
        name: 'Create Payment',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/receipt',
        name: 'Receipt',
        pKey: 'voucher'},
      {path: 'voucher/receipt/create',
        name: 'Create Receipt',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/contra',
        name: 'Contra',
        pKey: 'voucher'},
      {path: 'voucher/contra/create',
        name: 'Create Contra',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/journal',
        name: 'Journal',
        pKey: 'voucher'},
      {path: 'voucher/journal/create',
        name: 'Create Journal',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/credit-note',
        name: 'Credit Note',
        pKey: 'voucher'},
      {path: 'voucher/credit-note/create',
        name: 'Create Credit Note',
        pKey: 'voucher',
        noShow: true},
      {path: 'voucher/debit-note',
        name: 'Debit Note',
        pKey: 'voucher'},
      {path: 'voucher/debit-note/create',
        name: 'Create Debit Note',
        pKey: 'voucher',
        noShow: true},
    ] },
  {path: 'reports',
    name: 'Reports',
    icon: 'pie_chart',
    children: [
      {path: 'reports/ledger',
        name: 'Ledger',
        pKey: 'ledger'},
      {path: 'reports/ledger-group',
        name: 'Ledger Group',
        pKey: 'ledgergroup'},
      {path: 'reports/trial-balance',
        name: 'Trial Balance',
        pKey: 'voucher'},
      {path: 'reports/profit-loss',
        name: 'Profit and Loss',
        pKey: 'voucher'},
      {path: 'reports/balance-sheet',
        name: 'Balance Sheet',
        pKey: 'voucher'},
      {path: 'reports/day-book',
        name: 'Day Book',
        pKey: 'voucher'},
      {path: 'logs/request-logs',
        name: 'Request Logs',
        pKey: 'reqlogs'},
    ]},
  {path: 'setting',
    name: 'Settings',
    icon: 'settings',
    children: [
      {path: 'company',
        name: 'Company',
        pKey: 'company'},
      {path: 'branch',
        name: 'Branch',
        pKey: 'branch'},
      {path: 'fin-year',
        name: 'Fin Year',
        pKey: 'finyear'},
      {path: 'user',
        name: 'User',
        pKey: 'user'},
    ]}
];

const findPermittedSubMenus = (menu: MenuNode, permissions: Record<string, Permission>): MenuNode[] => {

  const childrenP:Array<MenuNode> = [];
  if (!menu.children) {

    // TO-DO
    return null;

  }
  for (const child of menu.children) {

    if (!permissions[child.pKey]) {

      continue;

    }
    if (permissions[child.pKey]?.operations?.view) {

      childrenP.push(child);

    }

  }
  return childrenP;

};

export const findPermittedMenus = (): MenuNode[] => {

  const userS = localStorage.getItem(LOCAL_USER_KEY);
  if (userS) {

    const sessionUser:SessionUser = JSON.parse(userS);
    const { user } = sessionUser;
    const { permissions } = user;
    const permittedMenus = [];
    for (const menu of menus) {

      const childrenP = findPermittedSubMenus(menu, permissions);
      if (childrenP && childrenP.length) {

        const {...menuT} = menu;
        menuT.children = childrenP;
        permittedMenus.push(menuT);

      }

    }
    return permittedMenus;

  }

  return [];

};
