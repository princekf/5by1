import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { DEFAULT_MAX_ROWS } from '@fboutil/constants';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseHTTPService<T> {

  public declare API_URI: string;

  constructor(
    protected readonly http: HttpClient
  ) { }


  public search(queryParams: QueryData): Observable<Array<T>> {

    const filterParam = JSON.stringify(queryParams);
    let params = new HttpParams();
    params = params.set('filter', filterParam);
    return this.http.get<Array<T>>(`${env.serverUrl}${this.API_URI}`, { params });

  }


  public distinct(columnName: string, queryParams: QueryData): Observable<{ data: Array<string> }> {

    const filterParam = JSON.stringify(queryParams);
    let params = new HttpParams();
    params = params.set('filter', filterParam);
    return this.http.get<{ data: Array<string> }>(`${env.serverUrl}${this.API_URI}/distinct/${columnName}`, { params });

  }

  public queryData(queryParams: QueryData): Observable<Array<T>> {

    const filterParam = JSON.stringify(queryParams);
    let params = new HttpParams();
    params = params.set('filter', filterParam);
    const itemsR$ = this.http.get<Array<T>>(`${env.serverUrl}${this.API_URI}`, { params });
    return itemsR$;

  }

  public list(queryParams: QueryData): Observable<ListQueryRespType<T>> {

    queryParams.limit = queryParams.limit ?? DEFAULT_MAX_ROWS;
    queryParams.offset = queryParams.offset ?? 0;
    const {limit, offset} = queryParams;
    const pageIndex = Math.ceil(offset / limit);
    const filterParam = JSON.stringify(queryParams);
    let params = new HttpParams();
    params = params.set('filter', filterParam);
    const itemsR$ = this.http.get<Array<T>>(`${env.serverUrl}${this.API_URI}`, { params });
    const countR$ = this.http.get<{ count: number }>(`${env.serverUrl}${this.API_URI}/count`, { params });
    return forkJoin([ itemsR$, countR$ ]).pipe(
      catchError((err) => throwError(err))
    )
      .pipe(
        map(([ items, count ]) => ({
          items,
          totalItems: count.count,
          pageIndex
        }))
      );

  }

  public save(item: T): Observable<T> {

    return this.http.post<T>(`${env.serverUrl}${this.API_URI}`, item).pipe(
      catchError((err) => throwError(err))
    );

  }


  public update(item: T): Observable<T> {

    const cObj = item as unknown as { id: string };
    return this.http.patch<number>(`${env.serverUrl}${this.API_URI}/${cObj.id}`, item).pipe(
      flatMap((count) => of(item))
    );

  }


  public get(objId: string, queryParams: QueryData): Observable<T> {

    const filterParam = JSON.stringify(queryParams);
    let params = new HttpParams();
    params = params.set('filter', filterParam);
    return this.http.get<T>(`${env.serverUrl}${this.API_URI}/${objId}`, { params }).pipe(
      catchError((err) => throwError(err))
    );

  }

  public delete(where: Record<string, unknown>): Observable<{ count: number }> {

    const filterParam = JSON.stringify(where);
    let params = new HttpParams();
    params = params.set('where', filterParam);
    return this.http['delete']<{ count: number }>(`${env.serverUrl}${this.API_URI}`, { params }).pipe(
      catchError((err) => throwError(err))
    );

  }

}
