import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-revenue',
  templateUrl: './filter-revenue.component.html',
  styleUrls: [ './filter-revenue.component.scss' ]
})
export class FilterRevenueComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    receivedDate: new FormControl(''),
    receivedDateType: new FormControl('eq'),
    receivedDateStart: new FormControl(''),
    receivedDateEnd: new FormControl(''),

    customer: new FormControl(''),
    customerType: new FormControl('^'),

    invoice: new FormControl(''),
    invoiceType: new FormControl('^'),

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
      {name: 'receivedDate',
        type: 'Date'},
      {name: 'customer',
        type: 'string'},
      {name: 'invoice',
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
