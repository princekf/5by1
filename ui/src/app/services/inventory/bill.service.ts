import {bill1, bill2} from '../mock-data/bill.data';
import { Bill } from '@shared/entity/inventory/bill';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})


export class BillService {

  constructor() {}

    private items:Array<Bill> = [ bill1, bill2 ]

    public listAll():Observable<Array<Bill>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

    public list(queryParams:QueryData):Observable<ListQueryRespType<Bill>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.offset ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Bill> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(ids: Array<string>):Observable<Array<Bill>> {

      const fItems = this.items.filter((billP) => ids.includes(billP.id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(ids: Array<string>):Observable<Array<Bill>> {

      const deletedArray:Array<Bill> = [];
      const balanceArray:Array<Bill> = [];
      // eslint-disable-next-line max-len
      this.items.forEach((billP) => (ids.includes(billP.id) ? deletedArray.push(billP) : balanceArray.push(billP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(bill:Bill):Observable<Bill> {

      const billC = <Bill> bill;
      billC.id = `autoid_${this.items.length}`;
      this.items.push(billC);
      return of(billC).pipe(delay(FAKE_TIMEOUT));

    }

    public update(bill:Bill):Observable<Bill> {

      const idx = this.items.findIndex((billT) => billT.id === bill.id);
      this.items[idx] = bill;
      return of(bill).pipe(delay(FAKE_TIMEOUT));

    }

    public get(objId:string):Observable<Bill> {

      const billC = this.items.find((billT) => billT.id === objId);
      return of(billC).pipe(delay(FAKE_TIMEOUT));

    }

}
