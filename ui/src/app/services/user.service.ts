import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '@shared/entity/auth/user';
import { SIGNUP_API, LOGIN_API_URI, ME_API, USER_API_URI } from '@shared/server-apis';
import { catchError, shareReplay } from 'rxjs/operators';
import { AuthResponse } from '@shared/util/auth-resp';
import { BaseHTTPService } from './base-http.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHTTPService<User> {

  public API_URI = USER_API_URI;

  signUp(user: User): Observable<User> {

    return this.http.post<User>(SIGNUP_API, user).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  login(user: { email: string; password: string; }): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(LOGIN_API_URI, user)
      .pipe(shareReplay())
      .pipe(
        catchError((err) => throwError(() => err))
      );

  }

  findMe(): Observable<User> {

    return this.http.get<User>(ME_API)
      .pipe(shareReplay())
      .pipe(
        catchError((err) => throwError(() => err))
      );

  }

  public upsert(user:User):Observable<void> {

    const {id, ...user2} = user;
    if (id) {

      return super.update({id,
        ...user2});

    }
    return super.save(user2);

  }

}
