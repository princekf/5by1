import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { MainService } from '@fboservices/main.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { Permission, User } from '@shared/entity/auth/user';

interface MenuNode {
  path: string;
  name: string;
  icon?: string;
  pKey?: string;
  children?: MenuNode[];
}

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

  /*
   *{path: 'banking',
   *  name: 'Banking',
   *  icon: 'business_center',
   *  children: [
   *    {path: 'transfer',
   *      name: 'Transfers'},
   *    {path: 'transaction',
   *      name: 'Transactions'},
   *  ] },
   */
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
      {path: 'cost-centre',
        name: 'Cost Centre',
        pKey: 'costcentre'},
    ] },
  {path: 'voucher',
    name: 'Voucher',
    icon: 'receipt_long',
    children: [
      {path: 'voucher-sales',
        name: 'Sales',
        pKey: 'voucher'},
      {path: 'voucher-purchase',
        name: 'Purchase',
        pKey: 'voucher'},
      {path: 'voucher-payment',
        name: 'Payment',
        pKey: 'voucher'},
      {path: 'voucher-receipt',
        name: 'Receipt',
        pKey: 'voucher'},
      {path: 'voucher-contra',
        name: 'Contra',
        pKey: 'voucher'},
      {path: 'voucher/journal',
        name: 'Journal',
        pKey: 'voucher'},
      {path: 'voucher-credit-note',
        name: 'Credit Note',
        pKey: 'voucher'},
      {path: 'voucher-debit-note',
        name: 'Debit Note',
        pKey: 'voucher'},
    ] },
  {path: 'report',
    name: 'Reports',
    icon: 'pie_chart'},
  {path: 'setting',
    name: 'Settings',
    icon: 'settings',
    children: [
      {path: 'company',
        name: 'Company'},
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

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: [ './left-nav.component.scss' ]
})
export class LeftNavComponent implements OnInit {

  treeControl = new NestedTreeControl<MenuNode>((node) => node.children);

  dataSource = new MatTreeNestedDataSource<MenuNode>();

  activeNode:MenuNode = null;

  leftMenuDrawerOpened = false;

  constructor(private readonly mainService: MainService) {}

  private findPermittedMenus = (menu: MenuNode, permissions: Record<string, Permission>) => {

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

  }

  ngOnInit(): void {

    const userS = localStorage.getItem(LOCAL_USER_KEY);
    if (userS) {

      const user:User = JSON.parse(userS);
      const {permissions} = user;
      const permittedMenus = [];
      for (const menu of menus) {

        const childrenP = this.findPermittedMenus(menu, permissions);
        if (childrenP && childrenP.length) {

          const {...menuT} = menu;
          menuT.children = childrenP;
          permittedMenus.push(menuT);

        }

      }

      this.dataSource.data = permittedMenus;

    }
    this.mainService.leftMenuDrawerSubject.subscribe((opened) => (this.leftMenuDrawerOpened = opened));

  }

  hasChild = (level: number, node: MenuNode):boolean => Boolean(node.children) && node.children.length > 0;

  handleMenuClick = (node: MenuNode):void => {

    this.activeNode = Boolean(node.children || node.children?.length) ? null : node;
    this.treeControl.isExpanded(node) ? this.treeControl.collapse(node) : this.treeControl.expand(node);

  }

}
