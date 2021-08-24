import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '@shared/entity/inventory/invoice';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { invoice1, invoice2 } from '../mock-data/invoice.data';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

    private items:Array<Invoice> = [ invoice1, invoice2 ]

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
