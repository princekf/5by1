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
      catchError((resp: HttpErrorResponse) => {

        let title = 'Error occured.';
        if ([ HTTP_RESPONSE_CODE.FORBIDDEN_USER, HTTP_RESPONSE_CODE.UNAUTHORIZED_USER ].includes(resp.status)) {

          title = 'Access denied';

        }
        const message = resp.error?.error?.message ?? 'Your session might have expired.<br/><a href=\"/login\">Please login again</a>';
        this.toastr.error(message, title, {
          enableHtml: true,
          closeButton: true,
          timeOut: 10000
        });
        return throwError(resp.error);

      }), map((event: HttpEvent<unknown>) => event)
    );

  }

}
