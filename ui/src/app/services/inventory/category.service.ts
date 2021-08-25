import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';
import { mobilePhones, television, computer, laptop } from '../mock-data/category.data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private items:Array<Category> = [ television, mobilePhones, computer, laptop ]

  constructor() { }


  public list(queryParams:QueryData):Observable<ListQueryRespType<Category>> {

    const limit = queryParams.limit ?? 10;
    const start = queryParams.start ?? 0;
    const pageIndex = Math.ceil(start / limit);
    const resp:ListQueryRespType<Category> = {
      totalItems: this.items.length,
      items: this.items.slice(start, start + limit),
      pageIndex
    };
    return of(resp).pipe(delay(FAKE_TIMEOUT));

  }

  public listAll():Observable<Array<Category>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

  public listByIds(ids: Array<string>):Observable<Array<Category>> {

    const fItems = this.items.filter((categoryP) => ids.includes(categoryP._id));
    return of(fItems).pipe(delay(FAKE_TIMEOUT));

  }

  public deleteByIds(ids: Array<string>):Observable<Array<Category>> {

    const deletedArray:Array<Category> = [];
    const balanceArray:Array<Category> = [];
    // eslint-disable-next-line max-len
    this.items.forEach((categoryP) => (ids.includes(categoryP._id) ? deletedArray.push(categoryP) : balanceArray.push(categoryP)));
    this.items = balanceArray;
    return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

  }

  public save(category:Category):Observable<Category> {

    const categoryC = <Category> category;
    categoryC._id = `auto_id_${this.items.length}`;
    this.items.push(categoryC);
    return of(categoryC).pipe(delay(FAKE_TIMEOUT));

  }


  public update(category:Category):Observable<Category> {

    const idx = this.items.findIndex((categoryT) => categoryT._id === category._id);
    this.items[idx] = category;
    return of(category).pipe(delay(FAKE_TIMEOUT));

  }

  public get(objId:string):Observable<Category> {

    const categoryC = this.items.find((categoryT) => categoryT._id === objId);
    return of(categoryC).pipe(delay(FAKE_TIMEOUT));

  }

}
