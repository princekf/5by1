import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '@shared/entity/inventory/vendor';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { VENDOR_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends BaseHTTPService<Vendor> {

    public API_URI = VENDOR_API_URI;

    public upsert(vendor:Vendor):Observable<void> {

      const {id, ...vendor2} = vendor;
      if (id) {

        return super.update({id,
          ...vendor2});

      }
      return super.save(vendor2);

    }

}
