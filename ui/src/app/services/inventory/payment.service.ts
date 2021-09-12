import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Payment } from '@shared/entity/inventory/payment';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { payment1, payment2, payment3 } from '../mock-data/payment.data';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})

export class PaymentService {

    private items:Array<Payment> = [ payment1, payment2, payment3 ]

    public list(queryParams:QueryData):Observable<ListQueryRespType<Payment>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.offset ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Payment> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(paymentIds: Array<string>):Observable<Array<Payment>> {

      const fItems = this.items.filter((paymentP) => paymentIds.includes(paymentP.id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public listAll():Observable<Array<Payment>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(paymentIds: Array<string>):Observable<Array<Payment>> {

      const deletedArray:Array<Payment> = [];
      const balanceArray:Array<Payment> = [];
      // eslint-disable-next-line max-len
      this.items.forEach((paymentP) => (paymentIds.includes(paymentP.id) ? deletedArray.push(paymentP) : balanceArray.push(paymentP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(payment:Payment):Observable<Payment> {

      const paymentC = <Payment> payment;
      paymentC.id = `autoid_${this.items.length}`;
      this.items.push(paymentC);
      return of(paymentC).pipe(delay(FAKE_TIMEOUT));

    }


    public update(payment:Payment):Observable<Payment> {

      const idx = this.items.findIndex((paymentT) => paymentT.id === payment.id);
      this.items[idx] = payment;
      return of(payment).pipe(delay(FAKE_TIMEOUT));

    }

    public get(paymentId:string):Observable<Payment> {

      const paymentC = this.items.find((paymentT) => paymentT.id === paymentId);
      return of(paymentC).pipe(delay(FAKE_TIMEOUT));

    }


}
