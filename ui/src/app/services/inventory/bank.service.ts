import { Injectable } from '@angular/core';
import { Bank } from '@shared/entity/inventory/bank';
import { Observable, of } from 'rxjs';
import {HDFC, ICICI, SBI} from '../mock-data/bank.data';
import { delay } from 'rxjs/internal/operators';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { BANK_API_URI } from '@shared/server-apis';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})

export class BankService extends BaseHTTPService<Bank> {

  public API_URI = BANK_API_URI;

  private items:Array<Bank> = [ HDFC, ICICI, SBI ]

  public listAll():Observable<Array<Bank>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

  public upsert(bank:Bank):Observable<void> {

    const {id, ...bank2} = bank;
    if (id) {

      return super.update({id,
        ...bank2});

    }
    return super.save(bank2);

  }

}
