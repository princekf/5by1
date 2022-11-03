import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STOCK_API_URI } from '@shared/server-apis';
import { StockSummary } from '@shared/util/stock-summary';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  public API_URI = STOCK_API_URI;

  constructor(
    protected readonly http: HttpClient
  ) { }

  public stockSummary(pid: string):Observable<Array<StockSummary>> {

    return this.http.get<Array<StockSummary>>(`${env.serverUrl}${this.API_URI}/summary/${pid}`).pipe(
      catchError((err) => throwError(() => err))
    );

  }

}
