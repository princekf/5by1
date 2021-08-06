import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tax, TaxS } from '@shared/entity/inventory/tax';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class TaxService {

    private items:Array<Tax> = [
      {_id: '01231',
        groupName: 'IGST',
        name: 'IGST 5%',
        rate: 5,
        appliedTo: 100,
        description: 'IGST 5% - For other state customers'},
      {_id: '01232',
        groupName: 'IGST',
        name: 'IGST 10%',
        rate: 10,
        appliedTo: 100,
        description: 'IGST 10% - For other state customers'},
      {_id: '01233',
        groupName: 'IGST',
        name: 'IGST 12%',
        rate: 12,
        appliedTo: 100,
        description: 'IGST 12% - For other state customers'},
      {_id: '01233',
        groupName: 'IGST',
        name: 'IGST 18%',
        rate: 18,
        appliedTo: 100,
        description: 'IGST 18% - For other state customers'},
      {_id: '01331',
        groupName: 'SGST',
        name: 'SGST 2.5%',
        rate: 2.5,
        appliedTo: 100,
        description: 'SGST 2.5% - For intra state sale'},
      {_id: '01332',
        groupName: 'SGST',
        name: 'SGST 5%',
        rate: 5,
        appliedTo: 100,
        description: 'SGST 5% - For intra state sale'},
      {_id: '01333',
        groupName: 'SGST',
        name: 'SGST 6%',
        rate: 6,
        appliedTo: 100,
        description: 'SGST 6% - For intra state sale'},
      {_id: '01333',
        groupName: 'SGST',
        name: 'SGST 9%',
        rate: 9,
        appliedTo: 100,
        description: 'SGST 9% - For intra state sale'},
      {_id: '01331',
        groupName: 'CGST',
        name: 'CGST 2.5%',
        rate: 2.5,
        appliedTo: 100,
        description: 'CGST 2.5% - For intra state sale'},
      {_id: '01332',
        groupName: 'CGST',
        name: 'CGST 5%',
        rate: 5,
        appliedTo: 100,
        description: 'CGST 5% - For intra state sale'},
      {_id: '01333',
        groupName: 'CGST',
        name: 'CGST 6%',
        rate: 6,
        appliedTo: 100,
        description: 'CGST 6% - For intra state sale'},
      {_id: '01333',
        groupName: 'CGST',
        name: 'CGST 9%',
        rate: 9,
        appliedTo: 100,
        description: 'CGST 9% - For intra state sale'}
    ]

    constructor() { }

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

    public save(tax:TaxS):Observable<Tax> {

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

}
