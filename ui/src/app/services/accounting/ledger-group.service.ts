import { Injectable } from '@angular/core';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { LEDGER_GROUP_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LedgerGroupService extends BaseHTTPService<LedgerGroup> {


  public API_URI = LEDGER_GROUP_API_URI;

  public upsert(ledgerGroup:LedgerGroup):Observable<void> {

    const {id, ...ledgerGroup2} = ledgerGroup;
    if (id) {

      return super.update({id,
        ...ledgerGroup2});

    }
    return super.save(ledgerGroup2);

  }

  public childs(where: {code: {inq: Array<string>}}): Observable<Array<LedgerGroup>> {

    const filterParam = JSON.stringify(where);
    let params = new HttpParams();
    params = params.set('where', filterParam);
    return this.http.get<Array<LedgerGroup>>(`${this.API_URI}/childs`, { params });

  }

}

