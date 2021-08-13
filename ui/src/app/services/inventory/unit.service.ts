import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class UnitService {

    private mgUnit:Unit = {_id: '01231',
      name: 'Millie gram',
      code: 'mg',
      decimalPlaces: 3}

      private mlUnit:Unit = {_id: '01221',
        name: 'Millie liter',
        code: 'ml',
        decimalPlaces: 3}

    private items:Array<Unit> = [
      this.mgUnit,
      {_id: '01232',
        name: 'Kilogram',
        code: 'kg',
        baseUnit: this.mgUnit,
        times: 1000,
        decimalPlaces: 3},
      this.mlUnit,
      {_id: '01222',
        name: 'Liter',
        code: 'ml',
        baseUnit: this.mlUnit,
        times: 1000,
        decimalPlaces: 3},

    ]

    public listAll():Observable<Array<Unit>> {

      return of(this.items).pipe(delay(FAKE_TIMEOUT));

    }

    public list(queryParams:QueryData):Observable<ListQueryRespType<Unit>> {

      const limit = queryParams.limit ?? 10;
      const start = queryParams.start ?? 0;
      const pageIndex = Math.ceil(start / limit);
      const resp:ListQueryRespType<Unit> = {
        totalItems: this.items.length,
        items: this.items.slice(start, start + limit),
        pageIndex
      };
      return of(resp).pipe(delay(FAKE_TIMEOUT));

    }

    public listByIds(ids: Array<string>):Observable<Array<Unit>> {

      const fItems = this.items.filter((unitP) => ids.includes(unitP._id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(ids: Array<string>):Observable<Array<Unit>> {

      const deletedArray:Array<Unit> = [];
      const balanceArray:Array<Unit> = [];
      this.items.forEach((unitP) => (ids.includes(unitP._id) ? deletedArray.push(unitP) : balanceArray.push(unitP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }

    public save(unit:Unit):Observable<Unit> {

      const unitC = <Unit> unit;
      unitC._id = `auto_id_${this.items.length}`;
      this.items.push(unitC);
      return of(unitC).pipe(delay(FAKE_TIMEOUT));

    }

    public update(unit:Unit):Observable<Unit> {

      const idx = this.items.findIndex((unitT) => unitT._id === unit._id);
      this.items[idx] = unit;
      return of(unit).pipe(delay(FAKE_TIMEOUT));

    }

    public get(objId:string):Observable<Unit> {

      const unitC = this.items.find((uitT) => uitT._id === objId);
      return of(unitC).pipe(delay(FAKE_TIMEOUT));

    }

}
