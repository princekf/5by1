import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // eslint-disable-next-line class-methods-use-this
  intercept(req: HttpRequest<unknown>,
    next: HttpHandler): Observable<HttpEvent<unknown>> {

    const idToken = localStorage.getItem(ACCESS_TOKEN_ID);

    if (idToken) {

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${idToken}`)
      });

      return next.handle(cloned);

    }

    return next.handle(req);

  }

}
