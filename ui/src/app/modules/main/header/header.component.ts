import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  leftMenuDrawerOpened = true;

  constructor(private readonly mainService: MainService,
    private router: Router) {}

  ngOnInit(): void {

    this.mainService.leftMenuDrawerSubject.subscribe((opened) => (this.leftMenuDrawerOpened = opened));

  }

  toggleLeftMenuDrawer = ():void => {

    this.mainService.toggleLeftMenuDrawer();

  }

  showLeftMenuDrawer = ():void => {

    this.mainService.showLeftMenuDrawer();

  }

  doLogout = ():void => {

    localStorage.removeItem(ACCESS_TOKEN_ID);
    this.router.navigate([ '/login' ]);

  };

}
