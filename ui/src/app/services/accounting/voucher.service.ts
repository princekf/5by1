import { Injectable } from '@angular/core';
import { Voucher } from '@shared/entity/accounting/voucher';
import { VOUCHER_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService extends BaseHTTPService<Voucher> {

  public API_URI = VOUCHER_API_URI;

  public upsert(voucher:Voucher):Observable<void> {

    const {id, ...voucher2} = voucher;
    if (id) {

      return super.update({id,
        ...voucher2});

    }
    return super.save(voucher2);

  }
}
