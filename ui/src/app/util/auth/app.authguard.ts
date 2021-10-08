import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { Injectable } from '@angular/core';
import { UserService } from '@fboservices/user.service';

@Injectable({
  providedIn: 'root',
})
export class AppAuthGuard implements CanActivate {

  constructor(private router: Router,
    private userService: UserService) { }

  private createUrlTree = (state: RouterStateSnapshot):UrlTree => {

    const urlTree = this.router.parseUrl('/login');
    urlTree.queryParams = {burl: state.url};
    return urlTree;

  }

  canActivate = async(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<boolean | UrlTree> => {

    if (!localStorage.getItem(ACCESS_TOKEN_ID)) {

      return this.createUrlTree(state);

    }
    try {

      const user = await this.userService.findMe().toPromise();
      if (user && user.id) {

        return true;

      }

    } catch (error) {

    }

    return this.createUrlTree(state);

  }

}
