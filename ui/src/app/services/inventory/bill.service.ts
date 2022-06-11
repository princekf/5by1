import { Bill, PurchaseItem } from '@shared/entity/inventory/bill';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { BILL_API_URI } from '@shared/server-apis';

@Injectable({
  providedIn: 'root'
})


export class BillService extends BaseHTTPService<Bill> {

  public API_URI = BILL_API_URI;


  private formatPurchaseItems = (bill:Bill, purchaseItems:Array<PurchaseItem>):void => {

    for (const pItem of purchaseItems) {

      const {product, unit, ...pItem2} = pItem;
      pItem2.productId = product.id;
      pItem2.unitId = unit.id;
      if (!pItem2.expiryDate) {

        delete pItem2.expiryDate;

      }
      if (!pItem2.mfgDate) {

        delete pItem2.mfgDate;

      }
      bill.purchaseItems.push(pItem2);

    }

  }

  public upsert = (bill:Bill):Observable<void | Bill> => {

    const {id, vendor, dueDate, orderDate, purchaseItems, ...bill2} = bill;
    bill2.vendorId = vendor?.id ?? '';
    let billDup:Bill = {...bill2};
    if (dueDate) {

      billDup = {dueDate,
        ...billDup};

    }
    if (orderDate) {

      billDup = {orderDate,
        ...billDup};

    }
    billDup.purchaseItems = [];
    this.formatPurchaseItems(billDup, purchaseItems);
    if (id) {

      return super.update({id,
        ...billDup});

    }
    return super.save(billDup);

  };

}
