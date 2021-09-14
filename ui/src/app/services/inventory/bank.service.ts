import { Injectable } from '@angular/core';
import { Bank } from '@shared/entity/inventory/bank';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { BANK_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})

export class BankService extends BaseHTTPService<Bank> {

  public API_URI = BANK_API_URI;

  public upsert(bank:Bank):Observable<void> {

    const {id, ...bank2} = bank;
    if (id) {

      return super.update({id,
        ...bank2});

    }
    return super.save(bank2);

  }

}
