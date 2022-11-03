import { Injectable } from '@angular/core';
import { Document as DocumentEnt } from '@shared/entity/common/document';
import { VOUCHER_API_URI } from '@shared/server-apis';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '@fboenvironments/environment';
@Injectable({
  providedIn: 'root'
})
export class VoucherDocumentService {

  public API_URI = VOUCHER_API_URI;


  constructor(
    protected readonly http: HttpClient
  ) { }

  public attatchDocument(voucherId: string, doc: DocumentEnt): Observable<DocumentEnt> {

    return this.http.post<DocumentEnt>(`${env.serverUrl}${this.API_URI}/${voucherId}/documents`, doc);

  }

  public getAttatchments(voucherId: string): Observable<DocumentEnt[]> {

    return this.http.get<DocumentEnt[]>(`${env.serverUrl}${this.API_URI}/${voucherId}/documents`);

  }

  public getAttatchmentSignedURL(voucherId: string, docId: string): Observable<{signedURL: string}> {

    return this.http.get<{signedURL: string}>(`${env.serverUrl}${this.API_URI}/${voucherId}/${docId}/signed-url`);

  }

  public removeAttatchment(voucherId: string, id: string): Observable<number> {

    const filterParam = JSON.stringify({id});
    let params = new HttpParams();
    params = params.set('where', filterParam);
    return this.http['delete']<number>(`${env.serverUrl}${this.API_URI}/${voucherId}/documents`, { params });

  }

}
