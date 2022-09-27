import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { Injectable } from '@angular/core';
import { UserService } from '@fboservices/user.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { MainService } from '@fboservices/main.service';

@Injectable({
  providedIn: 'root',
})
export class AppAuthGuard implements CanActivate {

  constructor(private router: Router,
    private userService: UserService,
<<<<<<< HEAD
    private dataService: MainService,) { }
=======
    private dataService: MainService) { }
>>>>>>> develop

  private createUrlTree = (state: RouterStateSnapshot): UrlTree => {

    const urlTree = this.router.parseUrl('/login');
    urlTree.queryParams = { burl: state.url };
    return urlTree;

  }

  canActivate = async(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {

    if (!localStorage.getItem(ACCESS_TOKEN_ID)) {

      return this.createUrlTree(state);

    }
    try {

      const userResp = await this.userService.findMe().toPromise();
      const { user } = userResp;
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userResp));
      this.setUserInfo(localStorage.getItem(LOCAL_USER_KEY));
<<<<<<< HEAD

=======
>>>>>>> develop
      if (user && user.id) {

        return true;

      }

    } catch (error) {

    }

    return this.createUrlTree(state);

  }

  setUserInfo(data: string): void {

    this.dataService.setUserInfo(data);

  }

}
