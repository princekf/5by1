import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '@shared/entity/inventory/invoice';
import { delay } from 'rxjs/internal/operators';
import { invoice1, invoice2 } from '../mock-data/invoice.data';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { INVOICE_API_URI } from '@shared/server-apis';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseHTTPService<Invoice> {

  public API_URI = INVOICE_API_URI;

    private items:Array<Invoice> = [ invoice1, invoice2 ]

    public listAll():Observable<Array<Invoice>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

}
