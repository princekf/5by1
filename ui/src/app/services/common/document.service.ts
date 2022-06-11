import { Injectable } from '@angular/core';
import { DOCUMENT_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Document } from '@shared/entity/common/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseHTTPService<Document> {

  public API_URI = DOCUMENT_API_URI;

}
