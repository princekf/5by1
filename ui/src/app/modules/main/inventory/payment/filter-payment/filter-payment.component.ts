import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Vendor } from '@shared/entity/inventory/vendor';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { Bank } from '@shared/entity/inventory/bank';
import { BankService } from '@fboservices/inventory/bank.service';
import { Bill } from '@shared/entity/inventory/bill';
import { BillService } from '@fboservices/inventory/bill.service';

@Component({
  selector: 'app-filter-payment',
  templateUrl: './filter-payment.component.html',
  styleUrls: [ './filter-payment.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterPaymentComponent {

  vendorFiltered: Array<Vendor> = [];

  bankFiltered: Array<Bank> = [];

  billfiltered: Array<Bill> = [];

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    paidDate: new FormControl(''),
    paidDateType: new FormControl('eq'),
    paidDateStart: new FormControl(''),
    paidDateEnd: new FormControl(''),

    vendorId: new FormControl(''),
    vendorIdType: new FormControl('^'),

    billId: new FormControl(''),
    billIdType: new FormControl('^'),

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
    private vendorService: VendorService,
    private bankService: BankService,
    private billService: BillService,) { }

    private handlevendorAutoChange = (vendorQ:string) => {

      if (typeof vendorQ !== 'string') {

        return;

      }
      this.vendorService.search({ where: {
        name: {like: vendorQ,
          options: 'i'},
      } })
        .subscribe((vendors) => (this.vendorFiltered = vendors));

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

    private handleBillAutoChange = (billQ:string) => {

      if (typeof billQ !== 'string') {

        return;

      }
      this.billService.search({ where: {
        billNumber: {like: billQ,
          options: 'i'},
      } })
        .subscribe((bills) => (this.billfiltered = bills));

    };

    ngOnInit():void {

      this.filterForm.controls.vendorId.valueChanges.subscribe(this.handlevendorAutoChange);
      this.filterForm.controls.bankId.valueChanges.subscribe(this.handleBankAutoChange);
      this.filterForm.controls.billId.valueChanges.subscribe(this.handleBillAutoChange);
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
        type: 'number'},
      {name: 'vendorId',
        type: 'string'},
      {name: 'billId',
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

  extractNameOfvendor= (idS: string): string => this.vendorFiltered.find((vendor) => vendor.id === idS)?.name;

  extractNameOfbank= (idS: string): string => this.bankFiltered.find((bank) => bank.id === idS)?.name;

  extractNameOfbill= (idS: string): string => this.billfiltered.find((bill) => bill.id === idS)?.billNumber;

}
