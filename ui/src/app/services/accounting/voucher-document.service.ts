import { Injectable } from '@angular/core';
import { Document as DocumentEnt } from '@shared/entity/common/document';
import { VOUCHER_API_URI } from '@shared/server-apis';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoucherDocumentService {

  public API_URI = VOUCHER_API_URI;


  constructor(
    protected readonly http: HttpClient
  ) { }

  public attatchDocument(voucherId: string, doc: DocumentEnt): Observable<DocumentEnt> {

    return this.http.post<DocumentEnt>(`${this.API_URI}/${voucherId}/documents`, doc);

  }

  public getAttatchments(voucherId: string): Observable<DocumentEnt[]> {

    return this.http.get<DocumentEnt[]>(`${this.API_URI}/${voucherId}/documents`);

  }

  public removeAttatchment(voucherId: string, id: string): Observable<number> {

    const filterParam = JSON.stringify({id});
    let params = new HttpParams();
    params = params.set('where', filterParam);
    return this.http['delete']<number>(`${this.API_URI}/${voucherId}/documents`, { params });

  }

}
