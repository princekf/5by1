import { Injectable } from '@angular/core';
import { FinYear } from '@shared/entity/auth/fin-year';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { FIN_YEAR_API_URI } from '@shared/server-apis';


@Injectable({
  providedIn: 'root'
})
export class FinYearService extends BaseHTTPService<FinYear> {

  public API_URI = FIN_YEAR_API_URI;

  public upsert(finYear:FinYear):Observable<void> {


    const {id, branch, ...branch2} = finYear;

    if (branch && branch.id) {

      branch2.branchId = branch.id;

    }
    if (id) {

      return super.update({id,
        ...branch2});

    }
    return super.save(branch2);

  }

}
