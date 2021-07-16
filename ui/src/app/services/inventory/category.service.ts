import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
import { delay } from 'rxjs/internal/operators';
import { QueryData } from '@shared/util/query-data';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private items:Array<Category> = [
    {
      name: 'Fridge',
      parent: {
        name: 'Household'
      }
    },
    {
      name: 'Washing Machine',
      parent: {
        name: 'Household'
      }
    },
    {
      name: 'Television',
      parent: {
        name: 'Electronics'
      }
    },
    {
      name: 'Mobile',
      parent: {
        name: 'Electronics'
      }
    }
  ]

  constructor() { }


  public list(queryParams:QueryData):Observable<Array<Category>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }
}
