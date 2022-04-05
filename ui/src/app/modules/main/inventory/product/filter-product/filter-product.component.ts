import { Component, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Category } from '@shared/entity/inventory/category';
import { CategoryService } from '@fboservices/inventory/category.service';


@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: [ './filter-product.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterProductComponent {

  queryParams:QueryData = { };

  categoryFiltered: Array<Category> = [];

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    nameType: new FormControl('^'),
    code: new FormControl(''),
    codeType: new FormControl('^'),
    brand: new FormControl(''),
    brandType: new FormControl('^'),
    location: new FormControl(''),
    locationType: new FormControl('^'),

    barcode: new FormControl(''),
    barcodeType: new FormControl('^'),
    reorderLevel: new FormControl(''),
    reorderLevelType: new FormControl('eq'),
    reorderLevelStart: new FormControl(''),
    reorderLevelEnd: new FormControl(''),

    categoryId: new FormControl(''),
    categoryIdType: new FormControl('^'),
    Status: new FormControl(''),
    StatusType: new FormControl('^'),

  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private categoryService: CategoryService,) { }

    private handlecategoryAutoChange = (categoryQ:string) => {

      if (typeof categoryQ !== 'string') {

        return;

      }
      this.categoryService.search({ where: {
        name: {like: categoryQ,
          options: 'i'},
      } })
        .subscribe((categorys) => (this.categoryFiltered = categorys));

    };

    ngOnInit():void {

      this.filterForm.controls.categoryId.valueChanges.subscribe(this.handlecategoryAutoChange);
      const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
      fillFilterForm(this.filterForm, whereS);

    }

    ngAfterViewInit():void {


      this.activatedRoute.queryParams.subscribe((value) => {

        this.queryParams = { ...value };

      });

    }

  filterItems = ():void => {


    const formFields: Array<FilterFormField> = [
      {name: 'name',
        type: 'string'},
      {name: 'code',
        type: 'string'},
      {name: 'brand',
        type: 'string'},
      {name: 'location',
        type: 'string'},
      {name: 'barcode',
        type: 'string'},
      {name: 'reorderLevel',
        type: 'number'},
      {name: 'categoryId',
        type: 'string'},
      {name: 'Status',
        type: 'string'},
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfcategory= (idS: string): string => this.categoryFiltered.find((cat) => cat.id === idS)?.name;

}
