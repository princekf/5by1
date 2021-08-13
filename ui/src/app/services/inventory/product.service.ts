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
      brand: 'Samsung',
      location: 'Rack-1',
      unit: this.numberUnit,
      status: 'Active',
      _id: 'a1'
    },
    {
      name: 'Realme 8 Pro',
      code: 'XYZ',
      brand: 'Samsung',
      location: 'Rack-1',
      unit: this.numberUnit,
      status: 'Active',
      _id: 'a2'
    },
    {
      name: 'Vivo iQOO 7',
      code: 'XYZ',
      brand: 'Samsung',
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

}
