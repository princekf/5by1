import { Injectable } from '@angular/core';
import { CostCentre } from '@shared/entity/accounting/cost-centre';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { COST_CENTRE_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class CostCentreService extends BaseHTTPService<CostCentre> {

  public API_URI = COST_CENTRE_API_URI;

  public upsert(ledger:CostCentre):Observable<void> {


    const {id, ...ledger2} = ledger;

    if (id) {

      return super.update({id,
        ...ledger2});

    }
    return super.save(ledger2);

  }

}
