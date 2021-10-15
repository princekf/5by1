import { Component } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { BillService } from '@fboservices/inventory/bill.service';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { Bill } from '@shared/entity/inventory/bill';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { ProductService } from '@fboservices/inventory/product.service';
import { Product } from '@shared/entity/inventory/product';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterBillComponent } from '../filter-bill/filter-bill.component';
@Component({
  selector: 'app-list-bill',
  templateUrl: './list-bill.component.html',
  styleUrls: [ './list-bill.component.scss' ]
})
export class ListBillComponent {

  displayedColumns: string[] = [ 'vendor.name', 'billDate', 'billNumber', 'totalAmount', 'totalDiscount', 'totalTax', 'grandTotal', 'isPaid' ];

  columnHeaders = {
    'vendor.name': 'Vendor',
    billDate: 'Bill Date',
    billNumber: 'bill Number #',
    totalAmount: 'Amount',
    totalDiscount: 'Discount',
    totalTax: 'Tax',
    grandTotal: 'Grand Total',
    isPaid: 'Paid'
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  bills:ListQueryRespType<Bill> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  products: Array<Product> =[];

  filterItem: FilterItem;


  columnParsingFn = (element:unknown, column:string): string => {


    switch (column) {

    case 'isPaid':
      return element[column] ? 'Yes' : 'No';
    case 'billDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly billService:BillService,
    private readonly productService:ProductService,
  ) { }

  private loadData = () => {

    this.loading = true;
    this.billService.list(this.queryParams).subscribe((bills) => {

      this.bills = bills;
      this.loading = false;

    }, (error) => {

      this.loading = false;

    });
    this.productService.search({}).subscribe((products) => {

      this.products = products;


    });

  };


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterBillComponent, {});

  }

  ngAfterViewInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      const {whereS, ...qParam} = value;
      this.queryParams = qParam;
      if (whereS) {

        this.queryParams.where = JSON.parse(whereS);

      }

      this.loadData();


    });

  }

}
