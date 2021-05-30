import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '@services/main.service';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.scss' ]
})
export class MainComponent implements OnInit {

  public showFiller = false;

  constructor(private router: Router, private readonly mainService: MainService) { }

  ngOnInit():void {
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
