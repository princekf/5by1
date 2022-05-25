import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { SessionUser } from '@shared/util/session-user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  leftMenuDrawerOpened = true;

  displayName: string;

  constructor(private readonly mainService: MainService,
    private dataservice: MainService,
    private router: Router) { }

  ngOnInit(): void {

    this.mainService.leftMenuDrawerSubject.subscribe((opened) => (this.leftMenuDrawerOpened = opened));
    const userS = localStorage.getItem(LOCAL_USER_KEY);
    if (userS) {

      const sessionUser: SessionUser = JSON.parse(userS);
      const { branch, finYear, user, company } = sessionUser;

      if (branch && finYear) {

        this.displayName = `${company.name}<br/>${branch.name} @ ${finYear.name}`;


      } else {

        this.displayName = user.name;

      }

    }
    this.getData();

  }

  getData(): void {

    this.dataservice.getData().subscribe((response) => {

      if (response) {

        const sessionUser: SessionUser = JSON.parse(response);
        const { branch, finYear, user, company } = sessionUser;
        if (branch && finYear) {

          this.displayName = `${company.name}<br/>${branch.name} @ ${finYear.name}`;


        } else {

          this.displayName = user.name;

        }

      }

    });

  }

  toggleLeftMenuDrawer = (): void => {

    this.mainService.toggleLeftMenuDrawer();

  }

  showLeftMenuDrawer = (): void => {

    this.mainService.showLeftMenuDrawer();

  }

  doLogout = (): void => {

    localStorage.removeItem(ACCESS_TOKEN_ID);
    this.router.navigate([ '/login' ]);

  };

  goToMyAccount = (): void => {

    this.router.navigate([ '/my-account' ]);

  };


}
