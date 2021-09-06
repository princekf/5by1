
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transfer } from '@shared/entity/inventory/transfer';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { transfer1, transfer2, transfer3} from '../mock-data/transfer.data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})


export class TransferService {


    private items:Array<Transfer> = [ transfer1, transfer2, transfer3 ]

    constructor() { }


    public list(queryParams:QueryData):Observable<ListQueryRespType<Transfer>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.start ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Transfer> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listAll():Observable<Array<Transfer>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(ids: Array<string>):Observable<Array<Transfer>> {

      const fItems = this.items.filter((transferP) => ids.includes(transferP.id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(ids: Array<string>):Observable<Array<Transfer>> {

      const deletedArray:Array<Transfer> = [];
      const balanceArray:Array<Transfer> = [];
      // eslint-disable-next-line max-len
      this.items.forEach((transferP) => (ids.includes(transferP.id) ? deletedArray.push(transferP) : balanceArray.push(transferP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(transfer:Transfer):Observable<Transfer> {

      const transferC = <Transfer> transfer;
      transferC.id = `autoid_${this.items.length}`;
      this.items.push(transferC);
      return of(transferC).pipe(delay(FAKE_TIMEOUT));

    }


    public update(transfer:Transfer):Observable<Transfer> {

      const idx = this.items.findIndex((transferT) => transferT.id === transfer.id);
      this.items[idx] = transfer;
      return of(transfer).pipe(delay(FAKE_TIMEOUT));

    }

    public get(objId:string):Observable<Transfer> {

      const transferC = this.items.find((transferT) => transferT.id === objId);
      return of(transferC).pipe(delay(FAKE_TIMEOUT));

    }

}
