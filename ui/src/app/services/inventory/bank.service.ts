import { Injectable } from '@angular/core';
import { Bank } from '@shared/entity/inventory/bank';
import { Observable, throwError } from 'rxjs';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { BANK_API_URI } from '@shared/server-apis';
import { catchError } from 'rxjs/operators';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService extends BaseHTTPService<Bank> {

  public API_URI = BANK_API_URI;

  public upsert(bank:Bank):Observable<Bank | void> {

    const {id, ...bank2} = bank;
    if (id) {

      return super.update({id,
        ...bank2});

    }
    return super.save(bank2);

  }

  public importBank(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${env.serverUrl}${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

}
