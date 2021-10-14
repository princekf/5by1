import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-payment',
  templateUrl: './filter-payment.component.html',
  styleUrls: [ './filter-payment.component.scss' ]
})
export class FilterPaymentComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    paidDate: new FormControl(''),
    paidDateType: new FormControl('eq'),
    paidDateStart: new FormControl(''),
    paidDateEnd: new FormControl(''),

    vendor: new FormControl(''),
    vendorType: new FormControl('^'),

    bill: new FormControl(''),
    billType: new FormControl('^'),

    bank: new FormControl(''),
    bankType: new FormControl('^'),

    Category: new FormControl(''),
    CategoryType: new FormControl('^'),

    amount: new FormControl(''),
    amountType: new FormControl('eq'),
    amountStart: new FormControl(''),
    amountEnd: new FormControl(''),
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
      {name: 'paidDate',
        type: 'Date'},
      {name: 'vendor',
        type: 'string'},
      {name: 'bill',
        type: 'string'},
      {name: 'bank',
        type: 'string'},
      {name: 'Category',
        type: 'string'},
      {name: 'amount',
        type: 'number'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };




}
