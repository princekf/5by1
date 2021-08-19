import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '@shared/entity/inventory/product';
import { delay } from 'rxjs/internal/operators';
import { Unit } from '../../../../../shared/dist/entity/inventory/unit';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private numberUnit:Unit = {
    name: 'Number',
    code: 'No',
    decimalPlaces: 0
  }

  private items:Array<Product> = [
    {
      name: 'Xiaomi Redmi Note 10',
      code: 'XYZ',
      brand: 'Redmi',
      location: 'Rack-1',
      unit: this.numberUnit,
      status: 'Active',
      _id: 'a1'
    },
    {
      name: 'Realme 8 Pro',
      code: 'XYZ',
      brand: 'Realme',
      location: 'Rack-1',
      unit: this.numberUnit,
      status: 'Active',
      _id: 'a2'
    },
    {
      name: 'Vivo iQOO 7',
      code: 'XYZ',
      brand: 'Vivo',
      location: 'Rack-1',
      unit: this.numberUnit,
      status: 'Active',
      _id: 'a3'
    },
    {
      name: 'Samsung Galaxy F62',
      code: 'XYZ',
      brand: 'Samsung',
      location: 'Rack-1',
      unit: this.numberUnit,
      status: 'Active',
      _id: 'a4'
    },

  ];

  constructor() { }

  public list(start:number, limit: number):Observable<Array<Product>> {

    return of(this.items).pipe(delay(FAKE_TIMEOUT));

  }

  public save(product:Product):Observable<Product> {

    const productC = <Product> product;
    productC._id = `auto_id_${this.items.length}`;
    this.items.push(productC);
    return of(productC).pipe(delay(FAKE_TIMEOUT));

  }

  public update(product:Product):Observable<Product> {

    const idx = this.items.findIndex((productT) => productT._id === product._id);
    this.items[idx] = product;
    return of(product).pipe(delay(FAKE_TIMEOUT));

  }

  public getname():Observable<Array<string>> {

    const groupNames:Array<string> = [];
    for (const productP of this.items) {

      if (!groupNames.includes(productP.name)) {

        groupNames.push(productP.name);

      }

    }
    return of(groupNames).pipe(delay(FAKE_TIMEOUT));

  }

}
