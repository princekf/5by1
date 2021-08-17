import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '@shared/entity/inventory/invoice';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Customer } from '@shared/entity/inventory/customer';
import { Product } from '@shared/entity/inventory/product';
import { Unit } from '@shared/entity/inventory/unit';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

    private customer1:Customer = {
      _id: 'cid_001',
      name: 'Customer 1',
      email: 'email@email.com',
      mobile: '098799'
    }

    private numberUnit: Unit = {
      _id: 'U-001',
      name: 'Number',
      code: 'No',
      decimalPlaces: 0,
    }

    private product1A: Product = {
      _id: 'A001',
      name: 'Samsung Mobile',
      unit: this.numberUnit,
      status: 'Active'
    }

    private customer2:Customer = {
      _id: 'cid_002',
      name: 'Customer 2',
      email: 'email2@email.com',
      mobile: '0987992'
    }

    private items:Array<Invoice> = [
      {_id: '01231',
        customer: this.customer1,
        invoiceDate: new Date('2020-04-13T00:00:00.000+05:30'),
        dueDate: new Date('2020-04-13T00:00:00.000+05:30'),
        invoiceNumber: 'INV-001',
        totalAmount: 1200,
        totalDisount: 0,
        totalTax: 200,
        roundOff: 0,
        grandTotal: 1400,
        isReceived: true,
        items: [ {
          product: this.product1A,
          unit: this.numberUnit,
          unitPrice: 10000,
          quantity: 1,
          discount: 0,
          taxes: [],
          totalTax: 0,
          totalAmount: 10000
        } ] },

    ]

    public list(queryParams:QueryData):Observable<ListQueryRespType<Invoice>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.start ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Invoice> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(taxIds: Array<string>):Observable<Array<Invoice>> {

      const fItems = this.items.filter((taxP) => taxIds.includes(taxP._id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(taxIds: Array<string>):Observable<Array<Invoice>> {

      const deletedArray:Array<Invoice> = [];
      const balanceArray:Array<Invoice> = [];
      this.items.forEach((taxP) => (taxIds.includes(taxP._id) ? deletedArray.push(taxP) : balanceArray.push(taxP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(tax:Invoice):Observable<Invoice> {

      const taxC = <Invoice> tax;
      taxC._id = `auto_id_${this.items.length}`;
      this.items.push(taxC);
      return of(taxC).pipe(delay(FAKE_TIMEOUT));

    }

    public update(tax:Invoice):Observable<Invoice> {

      const idx = this.items.findIndex((taxT) => taxT._id === tax._id);
      this.items[idx] = tax;
      return of(tax).pipe(delay(FAKE_TIMEOUT));

    }

    public get(taxId:string):Observable<Invoice> {

      const taxC = this.items.find((taxT) => taxT._id === taxId);
      return of(taxC).pipe(delay(FAKE_TIMEOUT));

    }

}
