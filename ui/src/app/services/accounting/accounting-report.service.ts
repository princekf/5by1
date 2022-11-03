import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ACC_REPORTS_API_URI } from '@shared/server-apis';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { DayBookItem } from '@shared/util/day-book-item';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { Observable } from 'rxjs';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountingReportService {

  public API_URI = ACC_REPORTS_API_URI;

  constructor(
    protected readonly http: HttpClient
  ) { }

  public fetchLedgerSummaryReportItems(startDate: string, endDate: string):Observable<Array<TrialBalanceItem>> {

    let params = new HttpParams();
    params = params.append('startDate', startDate).append('endDate', endDate);
    return this.http.get<Array<TrialBalanceItem>>(`${env.serverUrl}${this.API_URI}/ledger-summary`, {params});

  }

  public fetchLedgerGroupSummaryReportItems(ason: string):Observable<Array<TrialBalanceItem>> {

    let params = new HttpParams();
    params = params.append('ason', ason);
    return this.http.get<Array<TrialBalanceItem>>(`${env.serverUrl}${this.API_URI}/ledger-group-summary`, {params});

  }

  public fetchLedgerGroupReportItems(ason: string, plid: string):Observable<Array<LedgerReportItem>> {

    let params = new HttpParams();
    params = params.append('ason', ason).append('plid', plid);
    return this.http.get<Array<LedgerReportItem>>(`${env.serverUrl}${this.API_URI}/ledger-group-report`, {params});

  }

  public fetchLedgerReportItems(startDate: string, endDate: string, plid: string, clid?: string):
  Observable<Array<LedgerReportItem>> {

    let params = new HttpParams();
    params = params.append('startDate', startDate).append('endDate', endDate)
      .append('plid', plid)
      .append('clid', clid ?? '');
    return this.http.get<Array<LedgerReportItem>>(`${env.serverUrl}${this.API_URI}/ledger-report`, {params});

  }

  public fetchPLReportItems(startDate: string, endDate: string):Observable<Array<BalanceSheetItem>> {

    let params = new HttpParams();
    params = params.append('startDate', startDate).append('endDate', endDate);
    return this.http.get<Array<BalanceSheetItem>>(`${env.serverUrl}${this.API_URI}/profit-loss`, {params});

  }

  public fetchBalanceSheetItems(startDate: string, endDate: string):Observable<Array<BalanceSheetItem>> {

    let params = new HttpParams();
    params = params.append('startDate', startDate).append('endDate', endDate);
    return this.http.get<Array<BalanceSheetItem>>(`${env.serverUrl}${this.API_URI}/balance-sheet`, {params});

  }

  public fetchTrialBalanceItems(startDate: string, endDate: string):Observable<Array<TrialBalanceItem>> {

    let params = new HttpParams();
    params = params.append('startDate', startDate).append('endDate', endDate);
    return this.http.get<Array<TrialBalanceItem>>(`${env.serverUrl}${this.API_URI}/trial-balance`, {params});

  }

  public fetchDayBookItems(startDate: string, endDate: string):Observable<Array<DayBookItem>> {

    let params = new HttpParams();
    params = params.append('startDate', startDate);
    params = params.append('endDate', endDate);
    return this.http.get<Array<DayBookItem>>(`${env.serverUrl}${this.API_URI}/day-book`, {params});

  }

}
