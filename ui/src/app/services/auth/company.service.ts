import { Injectable } from '@angular/core';
import { Company } from '@shared/entity/auth/company';
import { Observable, throwError } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { COMPANY_API_URI } from '@shared/server-apis';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseHTTPService<Company> {


  public API_URI = COMPANY_API_URI;

  public upsert(company:Company & {password: string}):Observable<Company | void> {

    const {id, password, ...company2} = company;
    if (id) {

      return super.update({id,
        ...company2});

    }
    return this.http.post<void>(this.API_URI, {password,
      ...company2}).pipe(
      catchError((err) => throwError(err))
    );

  }

}
