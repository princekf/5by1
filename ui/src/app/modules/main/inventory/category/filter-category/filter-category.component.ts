import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: [ './filter-category.component.scss' ]
})
export class FilterCategoryComponent {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    parent: new FormControl(''),
    parentType: new FormControl('^'),
    name: new FormControl(''),
    nameType: new FormControl('^'),

    unit: new FormControl(''),
    unitType: new FormControl('^'),


    hsnNumber: new FormControl(''),
    hsnNumberType: new FormControl('^'),

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
      {name: 'parent',
        type: 'string'},
      {name: 'name',
        type: 'string'},
      {name: 'unit',
        type: 'string'},
      {name: 'hsnNumber',
        type: 'string'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
