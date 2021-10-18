import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-transaction',
  templateUrl: './filter-transaction.component.html',
  styleUrls: [ './filter-transaction.component.scss' ]
})
export class FilterTransactionComponent {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    transactionDate: new FormControl(''),
    transactionDateType: new FormControl('eq'),
    transactionDateStart: new FormControl(''),
    transactionDateEnd: new FormControl(''),

    partyName: new FormControl(''),
    partyNameType: new FormControl('^'),

    billinvoiceNumber: new FormControl(''),
    billinvoiceNumberType: new FormControl('^'),


    bank: new FormControl(''),
    bankType: new FormControl('^'),

    category: new FormControl(''),
    categoryType: new FormControl('^'),


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

      {name: 'transactionDate',
        type: 'number'},
      {name: 'partyName',
        type: 'string'},
      {name: 'billinvoiceNumber',
        type: 'string'},
      {name: 'bank',
        type: 'string'},
      {name: 'category',
        type: 'string'},
      {name: 'amount',
        type: 'number'}


    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}

