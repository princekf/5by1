import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ACC_REPORTS_API_URI } from '@shared/server-apis';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountingReportService {

  public API_URI = ACC_REPORTS_API_URI;

  constructor(
    protected readonly http: HttpClient
  ) { }

  public fetchPLReportItems(ason: string):Observable<Array<BalanceSheetItem>> {

    return this.http.get<Array<BalanceSheetItem>>(`${this.API_URI}/profit-loss/${ason}`);

  }

  public fetchBalanceSheetItems(ason: string):Observable<Array<BalanceSheetItem>> {

    return this.http.get<Array<BalanceSheetItem>>(`${this.API_URI}/balance-sheet/${ason}`);

  }

  public fetchTrialBalanceItems(ason: string):Observable<Array<TrialBalanceItem>> {

    return this.http.get<Array<TrialBalanceItem>>(`${this.API_URI}/trial-balance/${ason}`);

  }

}
