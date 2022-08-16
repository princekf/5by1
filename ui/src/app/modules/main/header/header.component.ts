import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { SessionUser } from '@shared/util/session-user';
import { MenuNode, menus } from '../left-nav/left-nav.component';

const compBase = [ ...menus ];
const comp = compBase.splice(1);


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  filteredSearch:MenuNode[] = []

  leftMenuDrawerOpened = true;

  displayName: string;

  location: string;

  constructor(private readonly mainService: MainService,
    private dataService: MainService,
    private router: Router) {}

  ngOnInit() {

    this.location = location.host;
    this.filteredSearch = comp;

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
    this.fetchUserInfo();

  }


  searchKeyUp(event) {

    const query = event.target.value.toLocaleLowerCase();
    this.filteredSearch = [];
    comp.forEach((_menu) => {

      const menu = {..._menu};
      if (menu.name.toLocaleLowerCase().includes(query)) {

        this.filteredSearch.push(menu);
        return;

      }
      const children: MenuNode[] = [];
      for (const child of menu?.children) {

        if (child.name.toLocaleLowerCase().includes(query)) {

          children.push(child);

        }

      }
      menu.children = children;
      if (children?.length > 0) {

        this.filteredSearch.push(menu);

      }

    });

  }


  fetchUserInfo(): void {

    this.dataService.fetchUserInfo().subscribe((response) => {

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

  displayFn(user: { name: string; }): string {

    return user && user.name ? user.name : '';

  }

  pathFinder(event) {

    this.router.navigate([ event.path ]);

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
