

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserS } from '@shared/entity/User';
import { BASE_URI, USER_API, SIGNUP_API, LOGIN_API } from '@shared/serverAPI';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly http: HttpClient
  ) { }

  signUp(user: UserS): Observable<unknown> {

    return this.http.post<UserS>(`${BASE_URI}${USER_API}${SIGNUP_API}`, user).pipe(
      catchError((err) => throwError(err))
    );

  }

  login(user: { email: string; password: string; }): Observable<unknown> {

    return this.http.post(`${BASE_URI}${USER_API}${LOGIN_API}`, user).pipe(
      catchError((err) => throwError(err))
    );

  }

}
