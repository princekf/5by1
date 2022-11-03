import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Tax } from '@shared/entity/inventory/tax';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { TAX_API_URI } from '@shared/server-apis';
import { catchError } from 'rxjs/operators';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseHTTPService<Tax> {

  public API_URI = TAX_API_URI;

  public upsert(tax:Tax):Observable<Tax | void> {

    const {id, ...tax2} = tax;
    if (id) {

      return super.update({id,
        ...tax2});

    }
    return super.save(tax2);

  }

  public importTax(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${env.serverUrl}${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

}
