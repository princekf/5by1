import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-invoice',
  templateUrl: './filter-invoice.component.html',
  styleUrls: [ './filter-invoice.component.scss' ]
})
export class FilterInvoiceComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    customer: new FormControl(''),
    customerType: new FormControl('^'),

    invoiceDate: new FormControl(''),
    invoiceDateType: new FormControl('eq'),
    invoiceDateStart: new FormControl(''),
    invoiceDateEnd: new FormControl(''),

    invoiceNumber: new FormControl(''),
    invoiceNumberType: new FormControl('^'),

    totalAmount: new FormControl(''),
    totalAmountType: new FormControl('eq'),
    totalAmountStart: new FormControl(''),
    totalAmountEnd: new FormControl(''),


    totalDisount: new FormControl(''),
    totalDisountType: new FormControl('eq'),
    totalDisountStart: new FormControl(''),
    totalDisountEnd: new FormControl(''),

    totalTax: new FormControl(''),
    totalTaxType: new FormControl('eq'),
    totalTaxStart: new FormControl(''),
    totalTaxEnd: new FormControl(''),

    grandTotal: new FormControl(''),
    grandTotalType: new FormControl('eq'),
    grandTotalStart: new FormControl(''),
    grandTotalEnd: new FormControl(''),

    isReceived: new FormControl(''),
    isReceivedType: new FormControl('^'),


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

      {name: 'customer',
        type: 'string'},
      {name: 'invoiceDate',
        type: 'number'},
      {name: 'invoiceNumber',
        type: 'string'},
      {name: 'totalAmount',
        type: 'number'},
      {name: 'totalDisount',
        type: 'number'},
      {name: 'totalTax',
        type: 'number'},
      {name: 'grandTotal',
        type: 'number'},
      {name: 'isReceived',
        type: 'string'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

}
