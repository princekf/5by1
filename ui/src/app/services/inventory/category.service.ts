import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
import { BaseHTTPService } from '../base-http.service';
import { CATEGORY_API_URI } from '@shared/server-apis';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseHTTPService<Category> {


  public API_URI = CATEGORY_API_URI;

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

  public importCategory(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

}
