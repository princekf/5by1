import { Injectable } from '@angular/core';
import { Unit } from '@shared/entity/inventory/unit';
import { UNIT_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment as env } from '@fboenvironments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseHTTPService<Unit> {

  public API_URI = UNIT_API_URI;

  public upsert(unit:Unit):Observable<Unit | void> {

    const {id, ...unit2} = unit;
    if (id) {

      return super.update({id,
        ...unit2});

    }
    return super.save(unit2);

  }

  public importUnit(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${env.serverUrl}${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

}
