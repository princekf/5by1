import { Injectable } from '@angular/core';
import { Ledger } from '@shared/entity/accounting/ledger';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { LEDGER_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class LedgerService extends BaseHTTPService<Ledger> {

  public API_URI = LEDGER_API_URI;

  public upsert(ledger:Ledger):Observable<void> {


    const {id, ledgerGroup, ...ledger2} = ledger;

    if (ledgerGroup && ledgerGroup.id) {

      ledger2.ledgerGroupId = ledgerGroup.id;

    }
    if (id) {

      return super.update({id,
        ...ledger2});

    }
    return super.save(ledger2);

  }

}
