import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '@shared/entity/inventory/product';
import { delay } from 'rxjs/internal/operators';
import { hpDesktop1, lnvDesktop1 } from '../mock-data/product.data';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Category } from '@shared/entity/inventory/category';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private items:Array<Product> = [
    lnvDesktop1, hpDesktop1
  ];

  public list(queryParams:QueryData):Observable<ListQueryRespType<Product>> {

    const limit = queryParams.limit ?? 10;
    const start = queryParams.start ?? 0;
    const pageIndex = Math.ceil(start / limit);
    const resp:ListQueryRespType<Product> = {
      totalItems: this.items.length,
      items: this.items.slice(start, start + limit),
      pageIndex
    };
    return of(resp).pipe(delay(FAKE_TIMEOUT));

  }

  public listByIds(ids: Array<string>):Observable<Array<Product>> {

    const fItems = this.items.filter((unitP) => ids.includes(unitP.id));
    return of(fItems).pipe(delay(FAKE_TIMEOUT));

  }

  public listAll():Observable<Array<Product>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

  public deleteByIds(ids: Array<string>):Observable<Array<Product>> {

    const deletedArray:Array<Product> = [];
    const balanceArray:Array<Product> = [];
    this.items.forEach((unitP) => (ids.includes(unitP.id) ? deletedArray.push(unitP) : balanceArray.push(unitP)));
    this.items = balanceArray;
    return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

  }

  public save(unit:Product):Observable<Product> {

    const unitC = <Product> unit;
    unitC.id = `autoid_${this.items.length}`;
    this.items.push(unitC);
    return of(unitC).pipe(delay(FAKE_TIMEOUT));

  }

  public update(unit:Product):Observable<Product> {

    const idx = this.items.findIndex((unitT) => unitT.id === unit.id);
    this.items[idx] = unit;
    return of(unit).pipe(delay(FAKE_TIMEOUT));

  }

  public get(objId:string):Observable<Product> {

    const unitC = this.items.find((uitT) => uitT.id === objId);
    return of(unitC).pipe(delay(FAKE_TIMEOUT));

  }

  searchBrands(brandQ: string):Observable<Array<string>> {

    const productsF = this.items.filter((itemC) => itemC.brand?.toLowerCase().includes(brandQ.toLowerCase()));
    const brandsF:Array<string> = [];
    productsF.forEach((productP) => brandsF.push(productP.brand));
    return of(brandsF).pipe(delay(FAKE_TIMEOUT));

  }

  searchLocations(locationQ: string):Observable<Array<string>> {

    const productsF = this.items.filter((itemC) => itemC.location?.toLowerCase().includes(locationQ.toLowerCase()));
    const locationF:Array<string> = [];
    productsF.forEach((productP) => locationF.push(productP.location));
    return of(locationF).pipe(delay(FAKE_TIMEOUT));

  }

  searchColors(colorQ: string):Observable<Array<string>> {

    const colorF:Array<string> = [];
    this.items.forEach((productP) => {

      productP.colors?.forEach((color) => {

        if (color.toLowerCase().includes(colorQ.toLowerCase())) {

          if (!colorF.includes(color)) {

            colorF.push(color);

          }

        }

      });

    });
    return of(colorF).pipe(delay(FAKE_TIMEOUT));

  }

  searchCategories(cateagoryQ: string):Observable<Array<Category>> {

    const categoriesF:Array<Category> = [];
    this.items.forEach((productP) => {

      categoriesF.push(productP.category);

    });
    return of(categoriesF).pipe(delay(FAKE_TIMEOUT));

  }

}
