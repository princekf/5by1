import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '@shared/entity/inventory/payment';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { PAYMENT_API_URI } from '@shared/server-apis';


@Injectable({
  providedIn: 'root'
})

export class PaymentService extends BaseHTTPService<Payment> {

  public API_URI = PAYMENT_API_URI;

  public upsert(payment:Payment):Observable<void> {

    const {id, vendor, bill, bank, ...payment2} = payment;
    if (vendor && vendor.id) {

      payment2.vendorId = vendor.id;

    }
    if (bill && bill.id) {

      payment2.billId = bill.id;

    }
    if (bank && bank.id) {

      payment2.bankId = bank.id;

    }
    if (id) {

      return super.update({id,
        ...payment2});

    }
    return super.save(payment2);

  }

}
