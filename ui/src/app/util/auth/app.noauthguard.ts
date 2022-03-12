import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppNoAuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {

    if (!localStorage.getItem(ACCESS_TOKEN_ID)) {

      return true;

    }
    this.router.navigate([ '/' ]);
    return false;

  }

}
