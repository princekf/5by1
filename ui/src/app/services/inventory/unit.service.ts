import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';
import { catchError, map} from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { UNIT_API_URI } from '@shared/server-apis';

import { HttpClient, HttpParams } from '@angular/common/http';
import { DEFAULT_MAX_ROWS } from '@fboutil/constants';


@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(
    private readonly http: HttpClient
  ) { }

  public listAll():Observable<Array<Unit>> {

    return this.http.get<Array<Unit>>(UNIT_API_URI).pipe(
      catchError((err) => throwError(err))
    );

  }

  public list(queryParams:QueryData):Observable<ListQueryRespType<Unit>> {

    const limit = queryParams.limit ?? DEFAULT_MAX_ROWS;
    const offset = queryParams.start ?? 0;
    const pageIndex = Math.ceil(offset / limit);
    const filterParam = JSON.stringify({offset,
      limit});
    let params = new HttpParams();
    params = params.set('filter', filterParam);
    const itemsR = this.http.get<Array<Unit>>(UNIT_API_URI, {params});
    const countR = this.http.get<{count: number}>(`${UNIT_API_URI}/count`, {params});
    return forkJoin([ itemsR, countR ]).pipe(
      catchError((err) => throwError(err))
    )
      .pipe(
        map((results) => ({items: results[0],
          totalItems: results[1].count,
          pageIndex}))
      );

  }

  public listByIds(ids: Array<string>):Observable<Array<Unit>> {

    const filterParam = JSON.stringify({
      where: {
        id: {
          inq: ids
        }
      }
    });
    let params = new HttpParams();
    params = params.set('filter', filterParam);

    return this.http.get<Array<Unit>>(UNIT_API_URI, {params}).pipe(
      catchError((err) => throwError(err))
    );

  }

  public deleteByIds(ids: Array<string>):Observable<{count: number}> {

    const filterParam = JSON.stringify({
      id: {
        inq: ids
      }
    });
    let params = new HttpParams();
    params = params.set('where', filterParam);
    return this.http['delete']<{count: number}>(UNIT_API_URI, {params}).pipe(
      catchError((err) => throwError(err))
    );

  }

  public save(unit:Unit):Observable<void> {

    // eslint-disable-next-line no-unused-vars
    const {id, parent, ...unit2} = unit;
    if (parent && parent.id) {

      unit2.parentId = parent.id;

    }
    return this.http.post<void>(UNIT_API_URI, unit2).pipe(
      catchError((err) => throwError(err))
    );

  }

  public update(unit:Unit):Observable<void> {

    // eslint-disable-next-line no-unused-vars
    const {id, parent, ...unit2} = unit;
    if (parent && parent.id) {

      unit2.parentId = parent.id;

    }
    return this.http.patch<void>(`${UNIT_API_URI}/${unit.id}`, unit2).pipe(
      catchError((err) => throwError(err))
    );

  }

  public get(objId:string):Observable<Unit> {

    return this.http.get<Unit>(`${UNIT_API_URI}/${objId}`).pipe(
      catchError((err) => throwError(err))
    );

  }

}
