
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Revenue } from '@shared/entity/inventory/revenue';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { Revenue1, Revenue2, Revenue3 } from '../mock-data/revenue.data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class RevenueService {


  private items:Array<Revenue> = [ Revenue1, Revenue2, Revenue3 ]

  constructor() { }


  public list(queryParams:QueryData):Observable<ListQueryRespType<Revenue>> {

    const limit = queryParams.limit ?? 10;
    const start = queryParams.start ?? 0;
    const pageIndex = Math.ceil(start / limit);
    const resp:ListQueryRespType<Revenue> = {
      totalItems: this.items.length,
      items: this.items.slice(start, start + limit),
      pageIndex
    };
    return of(resp).pipe(delay(FAKE_TIMEOUT));

  }

  public listAll():Observable<Array<Revenue>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

  public listByIds(ids: Array<string>):Observable<Array<Revenue>> {

    const fItems = this.items.filter((revenueP) => ids.includes(revenueP._id));
    return of(fItems).pipe(delay(FAKE_TIMEOUT));

  }

  public deleteByIds(ids: Array<string>):Observable<Array<Revenue>> {

    const deletedArray:Array<Revenue> = [];
    const balanceArray:Array<Revenue> = [];
    // eslint-disable-next-line max-len
    this.items.forEach((revenueP) => (ids.includes(revenueP._id) ? deletedArray.push(revenueP) : balanceArray.push(revenueP)));
    this.items = balanceArray;
    return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

  }

  public save(revenue:Revenue):Observable<Revenue> {

    const revenueC = <Revenue> revenue;
    revenueC._id = `auto_id_${this.items.length}`;
    this.items.push(revenueC);
    return of(revenueC).pipe(delay(FAKE_TIMEOUT));

  }


  public update(revenue:Revenue):Observable<Revenue> {

    const idx = this.items.findIndex((revenueT) => revenueT._id === revenue._id);
    this.items[idx] = revenue;
    return of(revenue).pipe(delay(FAKE_TIMEOUT));

  }

  public get(objId:string):Observable<Revenue> {

    const revenueC = this.items.find((revenueT) => revenueT._id === objId);
    return of(revenueC).pipe(delay(FAKE_TIMEOUT));

  }

}
