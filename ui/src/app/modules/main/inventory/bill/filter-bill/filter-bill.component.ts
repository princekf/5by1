import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Vendor } from '@shared/entity/inventory/vendor';
import { VendorService } from '@fboservices/inventory/vendor.service';

@Component({
  selector: 'app-filter-bill',
  templateUrl: './filter-bill.component.html',
  styleUrls: [ './filter-bill.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterBillComponent {

  queryParams:QueryData = { };

  vendorFiltered: Array<Vendor> = [];

  filterForm: FormGroup = new FormGroup({

    vendorId: new FormControl(''),
    vendorIdType: new FormControl('^'),

    billDate: new FormControl(''),
    billDateType: new FormControl('eq'),
    billDateStart: new FormControl(''),
    billDateEnd: new FormControl(''),

    billNumber: new FormControl(''),
    billNumberType: new FormControl('^'),

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

    isPaid: new FormControl(''),
    isPaidType: new FormControl('^'),


  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private vendorService: VendorService,) { }


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

    ngOnInit():void {

      this.filterForm.controls.vendorId.valueChanges.subscribe(this.handlevendorAutoChange);
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

      {name: 'vendorId',
        type: 'string'},
      {name: 'billDate',
        type: 'number'},
      {name: 'billNumber',
        type: 'string'},
      {name: 'totalAmount',
        type: 'number'},
      {name: 'totalDisount',
        type: 'number'},
      {name: 'totalTax',
        type: 'number'},
      {name: 'grandTotal',
        type: 'number'},
      {name: 'isPaid',
        type: 'string'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfvendor= (idS: string): string => this.vendorFiltered.find((vendor) => vendor.id === idS)?.name;

}
