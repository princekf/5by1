import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '@shared/entity/inventory/item';
import { delay } from 'rxjs/internal/operators';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private items:Array<Item> = [
    {
      name: 'Xiaomi Redmi Note 10',
      pPrice: 11243,
      sPrice: 12499,
      status: 'Active',
      _id: 'a1'
    },
    {
      name: 'Realme 8 Pro',
      pPrice: 17999,
      sPrice: 15476,
      status: 'Active',
      _id: 'a2'
    },
    {
      name: 'Vivo iQOO 7',
      pPrice: 31990,
      sPrice: 26789,
      status: 'Active',
      _id: 'a3'
    },
    {
      name: 'Samsung Galaxy F62',
      pPrice: 24890,
      sPrice: 22659,
      status: 'Active',
      _id: 'a4'
    },
  ];

  constructor() { }

  public list(start:number, limit: number):Observable<Array<Item>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

}
