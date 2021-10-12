import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ACCESS_TOKEN_ID, HTTP_RESPONSE_CODE } from '@shared/Constants';
import { ToastrService } from 'ngx-toastr';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly toastr: ToastrService) { }

  intercept(req: HttpRequest<unknown>,
    next: HttpHandler): Observable<HttpEvent<unknown>> {

    let reqN = req;
    const idToken = localStorage.getItem(ACCESS_TOKEN_ID);

    if (idToken) {

      reqN = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${idToken}`)
      });

    }

    return next.handle(reqN).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === HTTP_RESPONSE_CODE.FORBIDDEN_USER) {

          this.toastr.error('Your session might have expired.<br/><a href=\"/login\">Please login again</a>', 'Session expired', {
            enableHtml: true,
            closeButton: true,
            timeOut: 10000
          });

        }
        return throwError(error);

      }), map((event: HttpEvent<unknown>) => event)
    );

  }

}
