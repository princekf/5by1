import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '@shared/entity/inventory/product';
import { delay } from 'rxjs/internal/operators';
import { hpDesktop1, lnvDesktop1 } from '../mock-data/product.data';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { PRODUCT_API_URI } from '@shared/server-apis';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHTTPService<Product> {

  public API_URI = PRODUCT_API_URI;

  private items:Array<Product> = [
    lnvDesktop1, hpDesktop1
  ];

  public listAll():Observable<Array<Product>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

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

}
