import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '@shared/entity/auth/user';
import { SIGNUP_API, LOGIN_API } from '@shared/server-apis';
import { catchError, shareReplay } from 'rxjs/operators';
import { AuthResponse } from '@shared/util/auth-resp';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly http: HttpClient
  ) { }

  signUp(user: User): Observable<User> {

    return this.http.post<User>(SIGNUP_API, user).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  login(user: { email: string; password: string; }): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(LOGIN_API, user)
      .pipe(shareReplay())
      .pipe(
        catchError((err) => throwError(() => err))
      );

  }

}
