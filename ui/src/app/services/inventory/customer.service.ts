import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { delay } from 'rxjs/internal/operators';
import { basha, jomon, pavithran } from '../mock-data/customer.data';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { CUSTOMER_API_URI } from '@shared/server-apis';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseHTTPService<Customer> {

    public API_URI = CUSTOMER_API_URI;

    private items:Array<Customer> = [ jomon, pavithran, basha ];

    public listAll():Observable<Array<Customer>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

    public upsert(product:Customer):Observable<void> {

      const {id, ...product2} = product;
      if (id) {

        return super.update({id,
          ...product2});

      }
      return super.save(product2);

    }

}
