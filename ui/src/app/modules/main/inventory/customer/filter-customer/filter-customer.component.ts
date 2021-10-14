import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';


@Component({
  selector: 'app-filter-customer',
  templateUrl: './filter-customer.component.html',
  styleUrls: [ './filter-customer.component.scss' ]
})
export class FilterCustomerComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    name: new FormControl(''),
    nameType: new FormControl('^'),

    email: new FormControl(''),
    emailType: new FormControl('^'),

    mobile: new FormControl(''),
    mobileType: new FormControl('^'),

    state: new FormControl(''),
    stateType: new FormControl('^'),

    address: new FormControl(''),
    addressType: new FormControl('^'),

    gstNo: new FormControl(''),
    gstNoType: new FormControl('^'),


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
      {name: 'mobile',
        type: 'string'},
      {name: 'state',
        type: 'string'},
      {name: 'address',
        type: 'string'},
      {name: 'gstNo',
        type: 'string'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
