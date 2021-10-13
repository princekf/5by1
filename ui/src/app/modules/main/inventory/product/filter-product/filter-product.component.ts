import { Component, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';


@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: [ './filter-product.component.scss' ]
})
export class FilterProductComponent {

  queryParams:QueryData = { };

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
    Category: new FormControl(''),
    CategoryType: new FormControl('^'),

  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,) { }

  ngOnInit():void {

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
      {name: 'Category',
        type: 'string'},
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

}
