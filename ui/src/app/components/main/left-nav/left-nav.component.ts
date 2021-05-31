import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { MainService } from '@services/main.service';

interface FoodNode {
  name: string;
  icon?: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Dashboard',
    icon: 'space_dashboard'
  },
  {name: 'Items',
    icon: 'layers'},
  {
    name: 'Sale',
    icon: 'paid',
    children: [
      {name: 'Invoices'},
      {name: 'Revenues'},
      {name: 'Customers'},
    ]
  },
  {name: 'Purchases',
    icon: 'shopping_cart',
    children: [
      {name: 'Bills'},
      {name: 'Payments'},
      {name: 'Vendors'},
    ]},
  {name: 'Banking',
    icon: 'business_center',
    children: [
      {name: 'Accounts'},
      {name: 'Tranfers'},
      {name: 'Transactions'},,
      {name: 'Reconciliations'},
    ] },
  {name: 'Reports',
    icon: 'pie_chart'},
  {name: 'Settings',
    icon: 'settings'},
];

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: [ './left-nav.component.scss' ]
})
export class LeftNavComponent implements OnInit {

  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);

  dataSource = new MatTreeNestedDataSource<FoodNode>();

  activeNode:FoodNode = null;

  leftMenuDrawerOpened = false;

  constructor(private readonly mainService: MainService) {

    this.dataSource.data = TREE_DATA;
    this.mainService.leftMenuDrawerSubject.subscribe((opened) => (this.leftMenuDrawerOpened = opened));

  }

  ngOnInit(): void {
  }

  hasChild = (level: number, node: FoodNode):boolean => Boolean(node.children) && node.children.length > 0;

  handleMenuClick = (node: FoodNode):void => {

    this.activeNode = Boolean(node.children || node.children?.length) ? null : node;
    this.treeControl.isExpanded(node) ? this.treeControl.collapse(node) : this.treeControl.expand(node);

  }

}
