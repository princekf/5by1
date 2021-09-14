import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@fboservices/inventory/product.service';
import { ToastrService } from 'ngx-toastr';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { Category } from '@shared/entity/inventory/category';
import { CategoryService } from '@fboservices/inventory/category.service';
import { Product } from '@shared/entity/inventory/product';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateProductComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Products';

  loading = false;

  categoryOptions: Observable<Array<Category>>;

  brandOptions: Observable<Array<string>>;

  locationOptions: Observable<Array<string>>;

  colorOptions: Observable<Array<string>>;

  colors: Array<string> = [];

  separatorKeysCodes: number[] = [ ENTER, COMMA ];

  @ViewChild('colorInput') colorInput: ElementRef<HTMLInputElement>;


  fboForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl(''),
    brand: new FormControl(''),
    location: new FormControl(''),
    barcode: new FormControl(''),
    description: new FormControl(''),
    reorderLevel: new FormControl(0),
    colors: new FormControl(''),
    hasBatch: new FormControl(false),
    status: new FormControl('Active'),
    category: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly productService:ProductService,
    private readonly categoryService:CategoryService,
    private readonly toastr: ToastrService) { }

    private initValueChanges = () => {

      this.brandOptions = this.fboForm.controls.brand.valueChanges
        .pipe(flatMap((nameQ) => this.productService.distinct('brand', { where: {brand: {like: nameQ,
          options: 'i'}}})))
        .pipe(map((distinctResp) => distinctResp.data));

      this.locationOptions = this.fboForm.controls.location.valueChanges
        .pipe(flatMap((nameQ) => this.productService.distinct('location', { where: {location: {like: nameQ,
          options: 'i'}}})))
        .pipe(map((distinctResp) => distinctResp.data));

      this.colorOptions = this.fboForm.controls.colors.valueChanges
        .pipe(flatMap((nameQ) => this.productService.distinct('colors', { where: {colors: {like: nameQ,
          options: 'i'}}})))
        .pipe(map((distinctResp) => distinctResp.data));

      this.categoryOptions = this.fboForm.controls.category.valueChanges
        .pipe(flatMap((nameQ) => {

          if (!nameQ || typeof nameQ !== 'string') {

            return of([]);

          }
          return this.categoryService.search({ where: {name: {like: nameQ,
            options: 'i'}} });

        }));

    }

    ngOnInit(): void {

      this.initValueChanges();

      const tId = this.route.snapshot.queryParamMap.get('id');
      if (tId) {

        this.formHeader = 'Update Products';

      }
      this.loading = true;
      if (tId) {

        const queryParam:QueryData = {
          include: [
            {relation: 'category'}
          ]
        };
        this.productService.get(tId, queryParam).subscribe((productC) => {

          if (!productC) {

            return;

          }
          this.colors = productC.colors;
          this.fboForm.setValue({id: productC.id,
            name: productC.name,
            code: productC.code ?? '',
            brand: productC.brand ?? '',
            location: productC.location ?? '',
            barcode: productC.barcode ?? '',
            description: productC.description ?? '',
            reorderLevel: productC.reorderLevel ?? 0,
            hasBatch: productC.hasBatch ?? false,
            status: productC.status ?? 'Active',
            category: productC.category ?? '',
            colors: productC.colors ?? ''});

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    }

    extractNameOfCategory = (category: Category): string => category.name;

    upsertProduct(): void {

      if (!this.fboForm.valid) {

        return;

      }
      this.loading = true;
      const productP = <Product> this.fboForm.value;
      productP.colors = this.colors;
      this.productService.upsert(productP).subscribe(() => {

        this.toastr.success(`Product ${productP.name} is saved successfully`, 'Product saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving product ${productP.name}`, 'Product not saved');
        console.error(error);

      });

    }

  addColor = (event: MatChipInputEvent):void => {

    const value = event.value?.trim() ?? '';
    if (value) {

      this.colors.push(value);

    }
    // Clear the input value
    event.input.value = '';

    this.fboForm.controls.colors.setValue(null);

  }

  removeColor = (color: string):void => {

    const index = this.colors.indexOf(color);
    if (index >= 0) {

      this.colors.splice(index, 1);

    }

  }

  onColorSelected = (event: MatAutocompleteSelectedEvent): void => {

    this.colors.push(event.option.viewValue);
    this.colorInput.nativeElement.value = '';
    this.fboForm.controls.colors.setValue(null);

  };


}

