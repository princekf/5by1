import {bill1, bill2} from '../mock-data/bill.data';
import { Bill } from '@shared/entity/inventory/bill';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
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

}
