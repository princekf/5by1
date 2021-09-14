import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { CUSTOMER_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseHTTPService<Customer> {

    public API_URI = CUSTOMER_API_URI;

    public upsert(customer:Customer):Observable<void> {

      const {id, ...customer2} = customer;
      if (id) {

        return super.update({id,
          ...customer2});

      }
      return super.save(customer2);

    }

}
