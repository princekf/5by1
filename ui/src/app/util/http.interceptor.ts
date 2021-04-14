import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HTTPInterceptor implements HttpInterceptor {

    private saveToLocalStorage = (key:string, value:string) => {

      if (value) {

        localStorage.setItem(key, value);

      }

    }

    private storeHeaderData = (resp:HttpResponseBase) => {

      const accessToken = resp.headers.get(ACCESS_TOKEN_ID);
      if (accessToken) {

        this.saveToLocalStorage(ACCESS_TOKEN_ID, accessToken);

      }

    }

    intercept = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {

      let authReq = req;

      if (localStorage.getItem(ACCESS_TOKEN_ID)) {

        authReq = authReq.clone({
          headers: req.headers.set(ACCESS_TOKEN_ID, localStorage.getItem(ACCESS_TOKEN_ID))
        });

      }

      return next.handle(authReq).pipe(
        catchError((errr: HttpErrorResponse) => {

          this.storeHeaderData(errr);
          return throwError(errr);

        }), map((event: HttpEvent<unknown>) => {

          if (event instanceof HttpResponse) {

            const resp:HttpResponse<unknown> = <HttpResponse<unknown>> event;
            this.storeHeaderData(resp);

          }
          return event;

        }));

    }

}
