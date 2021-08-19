import { Component, OnInit, } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Product } from '@shared/entity/inventory/product';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService} from '@fboservices/inventory/product.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
export interface Colour {
  name: string;
}
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
})


export class CreateProductComponent implements OnInit {

  visible = true;

  selectable = true;

  removable = true;

  addOnBlur = true;

  loading = false;

  private name: string[] = [];

  nameOptions: Observable<string[]>;

  categories: Array<Product> = [];

  readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

  colour: Colour[] = [
    {name: 'Red'},
    {name: 'Blue'},
    {name: 'Green'},
  ];

  add(event: MatChipInputEvent): void {

    const value = (event.value || '').trim();

    // Add our colour
    if (value) {

      this.colour.push({name: value});

    }

    /*
     * Clear the input value
     * event.chipInput!.clear();
     */

  }

  remove(colour: Colour): void {

    const index = this.colour.indexOf(colour);

    if (index >= 0) {

      this.colour.splice(index, 1);

    }

  }

  myControl = new FormControl();

  options: string[] = [ 'One', 'Two', 'Three' ];

  filteredOptions: Observable<string[]>;

  form: FormGroup = new FormGroup({

    name: new FormControl('', [ Validators.required ]),

    picture: new FormControl('', [ Validators.required ]),

    brand: new FormControl('', [ Validators.required ]),

    location: new FormControl('', [ Validators.required ]),

    code: new FormControl('', [ Validators.required ]),

    color: new FormControl('', [ Validators.required ]),
  });

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly productService:ProductService,
    private readonly toastr: ToastrService) { }

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();

    return this.options.filter((option) => option.toLowerCase().indexOf(filterValue) === 0);

  }

  ngOnInit(): void {

    this.nameOptions = this.form.controls.name.valueChanges.pipe(
      startWith(''), map((value) => this._filter(value))
    );
    this.productService.getname().subscribe((name) => {

      this.name = name;

    });

  }

  goToProducts(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/product' ], {queryParams: uParams});

  }

 
  upsertProducts(): void {

    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const categoryP = <Product> this.form.value;
    // eslint-disable-next-line max-len
    (categoryP._id ? this.productService.update(categoryP) : this.productService.save(categoryP)).subscribe((categoryC) => {

      this.toastr.success(`Category ${categoryC.name} is saved successfully`, 'Category saved');
      this.goToProducts();

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Category ${categoryP.name}`, 'Category not saved');
      console.error(error);

    });

  }

}

