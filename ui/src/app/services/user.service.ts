import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '@shared/entity/auth/user';
import { SessionUser } from '@shared/util/session-user';
import { LOGIN_API_URI, ME_API_URI, USER_API_URI, MY_ACCOUNT_API_URI, SWITCH_FIN_YEAR_API_URI, SIGNUP_API_URI } from '@shared/server-apis';
import { catchError, shareReplay } from 'rxjs/operators';
import { AuthResponse } from '@shared/util/auth-resp';
import { MyAccountResp } from '@shared/util/my-account-resp';
import { BaseHTTPService } from './base-http.service';
import { CaptchaResp } from '@fboutil/types/captcha.resp';
import { SignupParams } from '@fboutil/types/signup-req';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHTTPService<User> {

  public API_URI = USER_API_URI;

  captcha(): Observable<CaptchaResp> {

    return this.http.get<CaptchaResp>(`${SIGNUP_API_URI}/captcha`).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  signUp(params: SignupParams): Observable<SignupParams> {

    return this.http.post<SignupParams>(SIGNUP_API_URI, params).pipe(
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

  findMe(): Observable<SessionUser> {

    return this.http.get<SessionUser>(ME_API_URI)
      .pipe(shareReplay())
      .pipe(
        catchError((err) => throwError(() => err))
      );

  }

  myAccount(): Observable<MyAccountResp> {

    return this.http.get<MyAccountResp>(MY_ACCOUNT_API_URI)
      .pipe(shareReplay())
      .pipe(
        catchError((err) => throwError(() => err))
      );

  }

  changeFinYear(finYearId: string): Observable<{token: string}> {

    return this.http.post<{token: string}>(SWITCH_FIN_YEAR_API_URI, {finYearId})
      .pipe(shareReplay())
      .pipe(
        catchError((err) => throwError(() => err))
      );

  }

  public upsert(user: User): Observable<User | void> {

    const {id, password, ...user2} = user;
    if (id) {

      return super.update({id,
        ...user2});

    }
    return super.save({password,
      ...user2});

  }

}
