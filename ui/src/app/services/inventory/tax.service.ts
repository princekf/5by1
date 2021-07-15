import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tax } from '@shared/entity/inventory/tax';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';

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
        description: 'IGST 18% - For other state customers'}
    ]

    constructor() { }

    public list(queryParams:QueryData):Observable<Array<Tax>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

}
