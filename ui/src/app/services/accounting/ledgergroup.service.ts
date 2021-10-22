import { Injectable } from '@angular/core';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { LEDGER_GROUP_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LedgergroupService extends BaseHTTPService<LedgerGroup> {


  public API_URI = LEDGER_GROUP_API_URI;

  public upsert(ledgerGroup:LedgerGroup):Observable<void> {

    const {id, ...ledgerGroup2} = ledgerGroup;
    if (id) {

      return super.update({id,
        ...ledgerGroup2});

    }
    return super.save(ledgerGroup2);

  }

}

