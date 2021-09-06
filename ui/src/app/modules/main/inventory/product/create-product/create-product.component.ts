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

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateProductComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Products';

  loading = false;

  categories: Array<Category> = [];

  brandsFiltered: string[];

  locationsFiltered: string[];

  separatorKeysCodes: number[] = [ ENTER, COMMA ];

  colors: Array<string> = [];

  colorsFiltered: Array<string>;

  categoriesFiltered: Array<Category>;

  @ViewChild('colorInput') colorInput: ElementRef<HTMLInputElement>;


  fboForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl(''),
    brand: new FormControl(''),
    location: new FormControl(''),
    barcode: new FormControl(''),
    description: new FormControl(''),
    reorderLevel: new FormControl(''),
    colors: new FormControl(''),
    hasBatch: new FormControl(''),
    status: new FormControl(''),
    category: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly productService:ProductService,
    private readonly categoryService:CategoryService,
    private readonly toastr: ToastrService) { }

    private initValueChanges = () => {


      this.fboForm.controls.brand.valueChanges.subscribe((brandQ:string) => {

        if (!brandQ || !brandQ.length) {

          this.brandsFiltered?.splice(0, this.brandsFiltered.length);
          return;

        }

        this.productService.searchBrands(brandQ).subscribe((brands) => (this.brandsFiltered = brands));

      });
      this.fboForm.controls.location.valueChanges.subscribe((locationQ:string) => {

        if (!locationQ || !locationQ.length) {

          this.brandsFiltered?.splice(0, this.brandsFiltered.length);
          return;

        }

        this.productService.searchLocations(locationQ).subscribe((locations) => (this.locationsFiltered = locations));

      });
      this.fboForm.controls.colors.valueChanges.subscribe((colorQ:string) => {

        if (!colorQ || !colorQ.length) {

          this.colorsFiltered?.splice(0, this.colorsFiltered.length);
          return;

        }

        this.productService.searchColors(colorQ).subscribe((colors) => (this.colorsFiltered = colors));

      });
      this.fboForm.controls.category.valueChanges.subscribe((categoryQ:string) => {

        if (!categoryQ || !categoryQ.length) {

          this.colorsFiltered?.splice(0, this.colorsFiltered.length);
          return;

        }

        this.productService.searchCategories(categoryQ)
          .subscribe((categories) => (this.categoriesFiltered = categories));

      });

    }

    ngOnInit(): void {

      this.initValueChanges();

      const tId = this.route.snapshot.queryParamMap.get('id');
      if (tId) {

        this.formHeader = 'Update Products';

      }
      this.loading = true;
      this.categoryService.listAll().subscribe((categories) => {

        this.categories = categories;
        if (tId) {

          this.productService.get(tId).subscribe((unitC) => {

            if (!unitC) {

              return;

            }
            this.colors = unitC.colors;
            this.fboForm.setValue({id: unitC.id,
              name: unitC.name,
              code: unitC.code ?? '',
              brand: unitC.brand ?? '',
              location: unitC.location ?? '',
              barcode: unitC.barcode ?? '',
              description: unitC.description ?? '',
              reorderLevel: unitC.reorderLevel ?? 0,
              hasBatch: unitC.hasBatch ?? false,
              status: unitC.status ?? 'Active',
              category: unitC.category ?? '',
              colors: unitC.colors ?? ''});

            this.loading = false;

          });

        } else {

          this.loading = false;

        }

      });


    }

    extractNameOfCategory = (category: Category): string => category.name;

    upsertProduct(): void {

      if (!this.fboForm.valid) {

        return;

      }
      this.loading = true;
      const unitP = <Product> this.fboForm.value;
      (unitP.id ? this.productService.update(unitP) : this.productService.save(unitP)).subscribe((unitC) => {

        this.toastr.success(`Product ${unitC.name} is saved successfully`, 'Product saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving product ${unitP.name}`, 'Product not saved');
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

