import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-company',
  templateUrl: './filter-company.component.html',
  styleUrls: [ './filter-company.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterCompanyComponent implements OnInit {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    name: new FormControl(''),
    nameType: new FormControl('^'),

    code: new FormControl(''),
    codeType: new FormControl('^'),

    email: new FormControl(''),
    emailType: new FormControl('^'),

    address: new FormControl(''),
    addressType: new FormControl('^'),

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
      {name: 'email',
        type: 'string'},
      {name: 'address',
        type: 'string'}

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
