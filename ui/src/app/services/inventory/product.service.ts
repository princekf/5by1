import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '@shared/entity/inventory/product';
import { delay } from 'rxjs/internal/operators';
import { hpDesktop1, lnvDesktop1 } from '../mock-data/product.data';
import { QueryData } from '@shared/util/query-data';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private items:Array<Product> = [
    lnvDesktop1, hpDesktop1
  ];

  constructor() { }

  public list(queryParams:QueryData):Observable<Array<Product>> {

    const filteredItems = this.items.filter((prodP) => prodP.name.toLowerCase().includes(queryParams.qrs ?? ''));
    return of(filteredItems).pipe(delay(FAKE_TIMEOUT));

  }

}
