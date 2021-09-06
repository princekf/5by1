import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { basha, jomon, pavithran } from '../mock-data/customer.data';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    private items:Array<Customer> = [ jomon, pavithran, basha ];


    public list(queryParams:QueryData):Observable<ListQueryRespType<Customer>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.start ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Customer> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listAll():Observable<Array<Customer>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(taxIds: Array<string>):Observable<Array<Customer>> {

      const fItems = this.items.filter((taxP) => taxIds.includes(taxP.id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(taxIds: Array<string>):Observable<Array<Customer>> {

      const deletedArray:Array<Customer> = [];
      const balanceArray:Array<Customer> = [];
      this.items.forEach((taxP) => (taxIds.includes(taxP.id) ? deletedArray.push(taxP) : balanceArray.push(taxP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(tax:Customer):Observable<Customer> {

      const taxC = <Customer> tax;
      taxC.id = `autoid_${this.items.length}`;
      this.items.push(taxC);
      return of(taxC).pipe(delay(FAKE_TIMEOUT));

    }

    public update(tax:Customer):Observable<Customer> {

      const idx = this.items.findIndex((taxT) => taxT.id === tax.id);
      this.items[idx] = tax;
      return of(tax).pipe(delay(FAKE_TIMEOUT));

    }

    public get(taxId:string):Observable<Customer> {

      const taxC = this.items.find((taxT) => taxT.id === taxId);
      return of(taxC).pipe(delay(FAKE_TIMEOUT));

    }

    public getStates():Observable<Array<string>> {

      const groupNames:Array<string> = [];
      for (const taxP of this.items) {

        if (!groupNames.includes(taxP.state)) {

          groupNames.push(taxP.state);

        }

      }
      return of(groupNames).pipe(delay(FAKE_TIMEOUT));

    }

}
