import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
import { delay } from 'rxjs/internal/operators';
import { mobilePhones, television, computer, laptop } from '../mock-data/category.data';
import { BaseHTTPService } from '../base-http.service';
import { CATEGORY_API_URI } from '@shared/server-apis';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseHTTPService<Category> {


  public API_URI = CATEGORY_API_URI;

  private items:Array<Category> = [ television, mobilePhones, computer, laptop ]

  public upsert(category:Category):Observable<void> {

    const {id, parent, unit, ...category2} = category;
    if (parent && parent.id) {

      category2.parentId = parent.id;

    }
    if (unit && unit.id) {

      category2.unitId = unit.id;

    }
    if (id) {

      return super.update({id,
        ...category2});

    }
    return super.save(category2);

  }

  public listAll():Observable<Array<Category>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

}
