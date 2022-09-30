import { Injectable } from '@angular/core';
import { REQUEST_LOGS_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { RequestLog } from '@shared/entity/common/request-log';

@Injectable({
  providedIn: 'root'
})
export class RequestLogService extends BaseHTTPService<RequestLog> {

  public API_URI = REQUEST_LOGS_API_URI;

}
