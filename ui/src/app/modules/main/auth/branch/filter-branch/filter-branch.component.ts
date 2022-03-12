import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-branch',
  templateUrl: './filter-branch.component.html',
  styleUrls: [ './filter-branch.component.scss', '../../../../../util/styles/fbo-filter-style.scss']
})
export class FilterBranchComponent implements OnInit {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    name: new FormControl(''),
    nameType: new FormControl('^'),

    email: new FormControl(''),
    emailType: new FormControl('^'),

    address: new FormControl(''),
    addressType: new FormControl('^'),

    finYearStartDate: new FormControl(''),
    finYearStartDateType: new FormControl('eq'),
    finYearStartDateStart: new FormControl(''),
    finYearStartDateEnd: new FormControl(''),


    defaultFinYear: new FormControl(''),
    defaultFinYearType: new FormControl('^'),
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
      {name: 'email',
        type: 'string'},
      {name: 'address',
        type: 'string'},
      {name: 'finYearStartDate',
        type: 'number'},
      {name: 'defaultFinYear',
        type: 'string'},

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

}
