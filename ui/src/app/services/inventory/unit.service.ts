import { Injectable } from '@angular/core';
import { Unit } from '@shared/entity/inventory/unit';
import { UNIT_API_URI } from '@shared/server-apis';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseHTTPService<Unit> {

  public API_URI = UNIT_API_URI;

  public upsert(unit:Unit):Observable<void> {

    const {id, ...unit2} = unit;
    if (id) {

      return super.update({id,
        ...unit2});

    }
    return super.save(unit2);

  }

}
