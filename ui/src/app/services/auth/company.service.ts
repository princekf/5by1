import { Injectable } from '@angular/core';
import { Company } from '@shared/entity/auth/company';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { COMPANY_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseHTTPService<Company> {


  public API_URI = COMPANY_API_URI;

  public upsert(company:Company):Observable<void> {

    const {id, ...company2} = company;
    if (id) {

      return super.update({id,
        ...company2});

    }
    return super.save(company2);

  }

}
