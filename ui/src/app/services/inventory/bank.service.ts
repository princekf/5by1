import { Injectable } from '@angular/core';
import { QueryData } from '@shared/util/query-data';
import { Bank } from '@shared/entity/inventory/bank';
import { Observable, of } from 'rxjs';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import {Other, bank, cash } from '../mock-data/bank.data';
import { delay } from 'rxjs/internal/operators';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})

export class BankService {

  constructor() {}

  private items:Array<Bank> = [ bank, cash, Other ]


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


}
