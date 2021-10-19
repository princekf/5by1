import { Injectable } from '@angular/core';
import { Invoice, SaleItem } from '@shared/entity/inventory/invoice';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { INVOICE_API_URI } from '@shared/server-apis';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseHTTPService<Invoice> {

  public API_URI = INVOICE_API_URI;

  private formatSaleItems = (invoice:Invoice, salteItems:Array<SaleItem>):void => {

    for (const pItem of salteItems) {

      const {product, unit, ...pItem2} = pItem;
      pItem2.productId = product.id;
      pItem2.unitId = unit.id;
      if (!pItem2.expiryDate) {

        delete pItem2.expiryDate;

      }
      if (!pItem2.mfgDate) {

        delete pItem2.mfgDate;

      }
      invoice.saleItems.push(pItem2);

    }

  }

  public upsert = (invoice:Invoice):Observable<void> => {

    const {id, customer, dueDate, invoiceDate, saleItems, ...invoice2} = invoice;
    invoice2.customerId = customer?.id ?? '';
    let invoiceDup:Invoice = {...invoice2};
    if (dueDate) {

      invoiceDup = {dueDate,
        ...invoiceDup};

    }
    if (invoiceDate) {

      invoiceDup = {invoiceDate,
        ...invoiceDup};

    }
    invoiceDup.saleItems = [];
    this.formatSaleItems(invoiceDup, saleItems);
    if (id) {

      return super.update({id,
        ...invoiceDup});

    }
    return super.save(invoiceDup);

  };

}
