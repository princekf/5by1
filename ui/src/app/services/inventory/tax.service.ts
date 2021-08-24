import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tax } from '@shared/entity/inventory/tax';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { cgst2P5, cgst5, cgst6, cgst9, igst10, igst12, igst18, igst5, sgst2P5, sgst5, sgst6, sgst9 } from '../mock-data/tax.data';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class TaxService {

    private items:Array<Tax> = [
      igst5, igst10, igst12, igst18, sgst2P5, sgst5, sgst6, sgst9, cgst2P5, cgst5, cgst6, cgst9
    ]

    public list(queryParams:QueryData):Observable<ListQueryRespType<Tax>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.start ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Tax> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(taxIds: Array<string>):Observable<Array<Tax>> {

      const fItems = this.items.filter((taxP) => taxIds.includes(taxP._id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(taxIds: Array<string>):Observable<Array<Tax>> {

      const deletedArray:Array<Tax> = [];
      const balanceArray:Array<Tax> = [];
      this.items.forEach((taxP) => (taxIds.includes(taxP._id) ? deletedArray.push(taxP) : balanceArray.push(taxP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(tax:Tax):Observable<Tax> {

      const taxC = <Tax> tax;
      taxC._id = `auto_id_${this.items.length}`;
      this.items.push(taxC);
      return of(taxC).pipe(delay(FAKE_TIMEOUT));

    }

    public update(tax:Tax):Observable<Tax> {

      const idx = this.items.findIndex((taxT) => taxT._id === tax._id);
      this.items[idx] = tax;
      return of(tax).pipe(delay(FAKE_TIMEOUT));

    }

    public get(taxId:string):Observable<Tax> {

      const taxC = this.items.find((taxT) => taxT._id === taxId);
      return of(taxC).pipe(delay(FAKE_TIMEOUT));

    }

    public getGroupNames():Observable<Array<string>> {

      const groupNames:Array<string> = [];
      for (const taxP of this.items) {

        if (!groupNames.includes(taxP.groupName)) {

          groupNames.push(taxP.groupName);

        }

      }
      return of(groupNames).pipe(delay(FAKE_TIMEOUT));

    }

}
