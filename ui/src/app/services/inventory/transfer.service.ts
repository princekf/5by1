
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transfer } from '@shared/entity/inventory/transfer';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { TRANSFER_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})


export class TransferService extends BaseHTTPService<Transfer> {


  public API_URI = TRANSFER_API_URI;

  public upsert(transfer:Transfer):Observable<void> {

    const {id, fromAccount, toAccount, ...transfer2} = transfer;
    if (fromAccount && fromAccount.id) {

      transfer2.fromAccountId = fromAccount.id;

    }
    if (toAccount && toAccount.id) {

      transfer2.toAccountId = toAccount.id;

    }
    if (id) {

      return super.update({id,
        ...transfer2});

    }
    return super.save(transfer2);

  }

}
