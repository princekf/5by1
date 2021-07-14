import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MainService } from '@services/main.service';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.scss' ]
})
export class MainComponent implements OnInit {

  menuMode = 'side';

  defaultOpen = true;

  @ViewChild('drawer') drawer: MatDrawer;

  constructor(private router: Router, private readonly mainService: MainService) { }

  ngOnInit():void {

    if (this.mainService.isMobileView()) {

      this.defaultOpen = false;
      this.menuMode = 'over';

    }

    this.mainService.leftMenuDrawerMobileSubject.subscribe((opened) => {

      if (opened) {

        this.menuMode = 'over';
        this.drawer?.open();

      }

    });

  }

  logout = ():void => {

    localStorage.removeItem(ACCESS_TOKEN_ID);
    this.router.navigate([ '/login' ]);

  }

  openLeftMenuDrawer = ():void => {

    this.mainService.setLeftMenuDrawerSubject(true);

  }

  closeLeftMenuDrawer = ():void => {

    this.mainService.setLeftMenuDrawerSubject(this.mainService.getLeftMenuLastToggleStatus());

  }

}
