import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-voucher',
  templateUrl: './filter-voucher.component.html',
  styleUrls: [ './filter-voucher.component.scss', '../../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterVoucherComponent implements OnInit {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    number: new FormControl(''),
    numberType: new FormControl('^'),

    date: new FormControl(''),
    dateType: new FormControl('eq'),
    dateStart: new FormControl(''),
    dateEnd: new FormControl(''),

    details: new FormControl(''),
    detailsType: new FormControl('^'),

    'transactions.amount': new FormControl(''),
    'transactions.amountType': new FormControl('eq'),
    'transactions.amountStart': new FormControl(''),
    'transactions.amountEnd': new FormControl(''),


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

      {name: 'number',
        type: 'string'},
      {name: 'details',
        type: 'string'},
      {name: 'transactions.amount',
        type: 'number'},
      {name: 'date',
        type: 'date'}

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

}
