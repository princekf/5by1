import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Bank } from '@shared/entity/inventory/bank';
import { Customer } from '@shared/entity/inventory/customer';
import { Invoice } from '@shared/entity/inventory/invoice';
import { BankService } from '@fboservices/inventory/bank.service';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { InvoiceService } from '@fboservices/inventory/invoice.service';

@Component({
  selector: 'app-filter-revenue',
  templateUrl: './filter-revenue.component.html',
  styleUrls: [ './filter-revenue.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterRevenueComponent {


  queryParams:QueryData = { };

  customerFiltered: Array<Customer> = [];

  bankFiltered: Array<Bank> = [];

  invoicefiltered: Array<Invoice> = [];

  filterForm: FormGroup = new FormGroup({
    receivedDate: new FormControl(''),
    receivedDateType: new FormControl('eq'),
    receivedDateStart: new FormControl(''),
    receivedDateEnd: new FormControl(''),

    customerId: new FormControl(''),
    customerIdType: new FormControl('^'),

    invoiceId: new FormControl(''),
    invoiceIdType: new FormControl('^'),

    bankId: new FormControl(''),
    bankIdType: new FormControl('^'),

    Category: new FormControl(''),
    CategoryType: new FormControl('^'),

    amount: new FormControl(''),
    amountType: new FormControl('eq'),
    amountStart: new FormControl(''),
    amountEnd: new FormControl(''),
  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private bankService: BankService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,) { }

    private handleCustomerAutoChange = (customerQ:string) => {

      if (typeof customerQ !== 'string') {

        return;

      }
      this.customerService.search({ where: {
        name: {like: customerQ,
          options: 'i'},
      } })
        .subscribe((customers) => (this.customerFiltered = customers));

    };

    private handleBankAutoChange = (bankQ:string) => {

      if (typeof bankQ !== 'string') {

        return;

      }
      this.bankService.search({ where: {
        name: {like: bankQ,
          options: 'i'},
      } })
        .subscribe((banks) => (this.bankFiltered = banks));

    };

    private handleInvoiceAutoChange = (invoiceQ:string) => {

      if (typeof invoiceQ !== 'string') {

        return;

      }
      this.invoiceService.search({ where: {
        invoiceNumber: {like: invoiceQ,
          options: 'i'},
      } })
        .subscribe((invoices) => (this.invoicefiltered = invoices));

    };

    ngOnInit():void {

      this.filterForm.controls.customerId.valueChanges.subscribe(this.handleCustomerAutoChange);
      this.filterForm.controls.bankId.valueChanges.subscribe(this.handleBankAutoChange);
      this.filterForm.controls.invoiceId.valueChanges.subscribe(this.handleInvoiceAutoChange);
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
        type: 'date'},
      {name: 'customerId',
        type: 'string'},
      {name: 'invoiceId',
        type: 'string'},
      {name: 'bankId',
        type: 'string'},
      {name: 'Category',
        type: 'string'},
      {name: 'amount',
        type: 'number'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfcustomer= (idS: string): string => this.customerFiltered.find((customer) => customer.id === idS)?.name;

  extractNameOfbank= (idS: string): string => this.bankFiltered.find((bank) => bank.id === idS)?.name;

  extractNameOfinvo= (idS: string): string => this.invoicefiltered.find((invoice) => invoice.id === idS)?.invoiceNumber;

}
