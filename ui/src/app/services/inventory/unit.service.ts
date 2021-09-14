import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';
import { catchError} from 'rxjs/internal/operators';
import { UNIT_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';


@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseHTTPService<Unit> {

  public API_URI = UNIT_API_URI;


  public listAll():Observable<Array<Unit>> {

    return this.http.get<Array<Unit>>(UNIT_API_URI).pipe(
      catchError((err) => throwError(err))
    );

  }

}
