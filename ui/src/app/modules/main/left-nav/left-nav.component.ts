import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { MainService } from '@fboservices/main.service';
import { Router } from '@angular/router';
import { MenuNode } from '@fboutil/menu/menu-node';
import { findPermittedMenus } from '@fboutil/menu/menus';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: [ './left-nav.component.scss' ]
})
export class LeftNavComponent implements OnInit {

  treeControl = new NestedTreeControl<MenuNode>((node) => node.children);

  dataSource = new MatTreeNestedDataSource<MenuNode>();

  activeNode:MenuNode = null;

  activeParentNode:MenuNode = null;

  leftMenuDrawerOpened = false;

  constructor(private readonly mainService: MainService,
    private readonly router: Router) {}


  ngOnInit(): void {

    const cUriS = this.router.url.split('?')[0].replace('/', '');

    const pMenusO = findPermittedMenus();
    const pMenus: MenuNode[] = [];
    pMenusO.forEach((menuT) => {

      if (menuT.noShow) {

        return;

      }
      const menuP = {...menuT};
      menuP.children = [];
      pMenus.push(menuP);
      menuT.children?.forEach((child) => {

        if (child.noShow) {

          return;

        }
        menuP.children.push(child);
        if (cUriS.indexOf(child.path) === 0) {

          this.activeNode = child;
          this.activeParentNode = menuT;

        }

      });

    });

    this.dataSource.data = pMenus;
    if (this.activeNode) {

      this.treeControl.expand(this.activeParentNode);

    }

    this.mainService.leftMenuDrawerSubject.subscribe((opened) => (this.leftMenuDrawerOpened = opened));

  }

  hasChild = (level: number, node: MenuNode):boolean => Boolean(node.children) && node.children.length > 0;

  handleMenuClick = (node: MenuNode):void => {

    this.activeNode = Boolean(node.children || node.children?.length) ? null : node;
    this.treeControl.isExpanded(node) ? this.treeControl.collapse(node) : this.treeControl.expand(node);

  }

  goToHome = ():void => {

    this.router.navigate([ '/' ], {});

  }

}
