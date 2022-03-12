import { Injectable } from '@angular/core';
import { Revenue } from '@shared/entity/inventory/revenue';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { REVENUE_API_URI } from '@shared/server-apis';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueService extends BaseHTTPService<Revenue> {

public API_URI = REVENUE_API_URI;

public upsert(revenue:Revenue):Observable<void> {

  const {id, customer, invoice, bank, ...revenue2} = revenue;
  revenue2.customerId = customer?.id ?? '';
  revenue2.invoiceId = invoice?.id ?? '';
  revenue2.bankId = bank?.id ?? '';
  if (id) {

    return super.update({id,
      ...revenue2});

  }
  return super.save(revenue2);

}

}
