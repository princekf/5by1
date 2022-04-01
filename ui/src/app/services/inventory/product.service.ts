import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Product } from '@shared/entity/inventory/product';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { PRODUCT_API_URI } from '@shared/server-apis';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHTTPService<Product> {

  public API_URI = PRODUCT_API_URI;

  public upsert(product:Product):Observable<void> {

    const {id, category, ...product2} = product;
    if (category && category.id) {

      product2.categoryId = category.id;

    }
    if (id) {

      return super.update({id,
        ...product2});

    }
    return super.save(product2);

  }

  public importProduct(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

}
