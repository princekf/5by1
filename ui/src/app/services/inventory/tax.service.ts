import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tax } from '@shared/entity/inventory/tax';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { TAX_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseHTTPService<Tax> {

  public API_URI = TAX_API_URI;

  public upsert(tax:Tax):Observable<void> {

    const {id, ...tax2} = tax;
    if (id) {

      return super.update({id,
        ...tax2});

    }
    return super.save(tax2);

  }

}
