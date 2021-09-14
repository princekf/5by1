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

    public upsert(customer:Customer):Observable<void> {

      const {id, ...customer2} = customer;
      if (id) {

        return super.update({id,
          ...customer2});

      }
      return super.save(customer2);

    }

}
