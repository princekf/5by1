import { Injectable } from '@angular/core';
import { Branch } from '@shared/entity/auth/branch';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { BRANCH_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseHTTPService<Branch> {

  public API_URI = BRANCH_API_URI;

  public upsert(branch:Branch):Observable<void> {


    const {id, defaultFinYear, ...branch2} = branch;

    if (defaultFinYear && defaultFinYear.id) {

      branch2.defaultFinYearId = defaultFinYear.id;

    }
    if (id) {

      return super.update({id,
        ...branch2});

    }
    return super.save(branch2);

  }

}
