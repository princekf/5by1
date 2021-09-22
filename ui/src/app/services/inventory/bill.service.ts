import {bill1, bill2 as bill21} from '../mock-data/bill.data';
import { Bill, PurchaseItem } from '@shared/entity/inventory/bill';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { BILL_API_URI } from '@shared/server-apis';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})


export class BillService extends BaseHTTPService<Bill> {


    private items:Array<Bill> = [ bill1, bill21 ]

    public listAll():Observable<Array<Bill>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }


  public API_URI = BILL_API_URI;


  private formatPurchaseItems = (bill:Bill, purchaseItems:Array<PurchaseItem>):void => {

    for (const pItem of purchaseItems) {

      const {product, unit, ...pItem2} = pItem;
      pItem.productId = product.id;
      pItem.unitId = unit.id;
      if (!pItem2.expiryDate) {

        delete pItem2.expiryDate;

      }
      if (!pItem2.mfgDate) {

        delete pItem2.mfgDate;

      }
      bill.purchaseItems.push(pItem2);

    }

  }

  public upsert = (bill:Bill):Observable<void> => {

    const {id, vendor, dueDate, orderDate, purchaseItems, ...bill2} = bill;
    if (vendor && vendor.id) {

      bill2.vendorId = vendor.id;

    }
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
