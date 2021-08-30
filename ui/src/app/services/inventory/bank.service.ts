import { Injectable } from '@angular/core';
import { QueryData } from '@shared/util/query-data';
import { Bank } from '@shared/entity/inventory/bank';
import { Observable, of } from 'rxjs';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import {HDFC, ICICI, SBI} from '../mock-data/bank.data';
import { delay } from 'rxjs/internal/operators';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})

export class BankService {

  constructor() {}

  private items:Array<Bank> = [ HDFC, ICICI, SBI ]


  public list(queryParams:QueryData):Observable<ListQueryRespType<Bank>> {

    const limit = queryParams.limit ?? 10;
    const start = queryParams.start ?? 0;
    const pageIndex = Math.ceil(start / limit);
    const resp:ListQueryRespType<Bank> = {
      totalItems: this.items.length,
      items: this.items.slice(start, start + limit),
      pageIndex
    };
    return of(resp).pipe(delay(FAKE_TIMEOUT));

  }

  public listAll():Observable<Array<Bank>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

  public listByIds(ids: Array<string>):Observable<Array<Bank>> {

    const fItems = this.items.filter((bankP) => ids.includes(bankP._id));
    return of(fItems).pipe(delay(FAKE_TIMEOUT));

  }


  public deleteByIds(ids: Array<string>):Observable<Array<Bank>> {

    const deletedArray:Array<Bank> = [];
    const balanceArray:Array<Bank> = [];
    // eslint-disable-next-line max-len
    this.items.forEach((bankP) => (ids.includes(bankP._id) ? deletedArray.push(bankP) : balanceArray.push(bankP)));
    this.items = balanceArray;
    return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

  }

  public save(banks:Bank):Observable<Bank> {

    const bankC = <Bank> banks;
    bankC._id = `auto_id_${this.items.length}`;
    this.items.push(bankC);
    return of(bankC).pipe(delay(FAKE_TIMEOUT));

  }

  public update(banks:Bank):Observable<Bank> {

    const idx = this.items.findIndex((bankT) => bankT._id === banks._id);
    this.items[idx] = banks;
    return of(banks).pipe(delay(FAKE_TIMEOUT));

  }

  public get(objId:string):Observable<Bank> {

    const bankC = this.items.find((bankT) => bankT._id === objId);
    return of(bankC).pipe(delay(FAKE_TIMEOUT));

  }

}
