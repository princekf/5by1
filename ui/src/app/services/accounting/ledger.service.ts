import { Injectable } from '@angular/core';
import { Ledger } from '@shared/entity/accounting/ledger';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseHTTPService } from '../base-http.service';
import { LEDGER_API_URI } from '@shared/server-apis';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class LedgerService extends BaseHTTPService<Ledger> {

  public API_URI = LEDGER_API_URI;

  public upsert(ledger:Ledger):Observable<Ledger | void> {


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

  public importLedger(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${env.serverUrl}${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

}
