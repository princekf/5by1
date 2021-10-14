import { Component} from '@angular/core';
import { RevenueService } from '@fboservices/inventory/revenue.service';
import { PaymentService } from '@fboservices/inventory/payment.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import { MainService } from '@fboservices/main.service';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterTransactionComponent } from '../filter-transaction/filter-transaction.component';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: [ './list-transaction.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class ListTransactionComponent {

  displayedColumns: string[] = [ 'receivedDate', 'customer.name', 'invoice.invoiceNumber', 'bank.name', 'category', 'amount', 'description' ];

  columnHeaders = {
    receivedDate: 'Transaction Date',
    'customer.name': 'PartyName',
    'invoice.invoiceNumber': 'bill-invoice#',
    'bank.name': 'bank',
    category: 'category',
    amount: 'Amount',
    description: 'Description',

  }


  findColumnValue = _findColumnValue;

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  mainHeader= 'Transaction';

  tableHeader = 'List of Transactions'

  revenues:ListQueryRespType<unknown> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  payments:ListQueryRespType<unknown> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  transactions:ListQueryRespType<unknown> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  dataSource = new MatTableDataSource<unknown>();

  extraColumns: Array<string>;


  constructor(private activatedRoute : ActivatedRoute,
    private revenueService:RevenueService,
    private paymentService:PaymentService,
    private readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly mainService: MainService,
  ) { }


  columnParsingFn = (element:any, column:string): string => {


    switch (column) {

    case 'receivedDate':
      return element?.paidDate && dayjs(element[column]).format(environment.dateFormat)
         || element?.receivedDate && dayjs(element[column]).format(environment.dateFormat);

    case 'customer.name':
      return element?.customer?.name || element?.vendor?.name;

    case 'invoice.invoiceNumber':
      return element?.invoice?.invoiceNumber || element?.bill?.billNumber;

    }
    return null;

  }

    private loadData = () => {

      this.loading = true;


      this.revenueService.list(this.queryParams).subscribe((revenues) => {

        this.revenues = revenues;
        this.queryParams.include = [
          {relation: 'vendor'}, {relation: 'bill'}, {relation: 'bank'}
        ];
        this.paymentService.list(this.queryParams).subscribe((payments) => {

          this.payments = payments;


          for (let index = 0; index < this.payments.items.length; index ++) {

            this.revenues.items.push(this.payments.items[index]);


          }


          this.transactions = revenues;

          this.dataSource = new MatTableDataSource<unknown>(revenues.items);


          this.loading = false;


        }, (error) => {

          console.error(error);
          this.loading = false;

        });

      });


    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterTransactionComponent, {});

    }

    ngAfterViewInit():void {

      this.activatedRoute.queryParams.subscribe((value) => {

        const {whereS, ...qParam} = value;
        this.queryParams = qParam;
        if (whereS) {

          this.queryParams.where = JSON.parse(whereS);

        }

        this.loadData();


        if (this.mainService.isMobileView()) {

          const COLUMN_COUNT_MOBILE_VIEW = 3;
          this.extraColumns = this.displayedColumns;
          this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

        }

      });

    }


    onPaymentClick(): void {

      this.router.navigate([ '/payment/create' ], { queryParams: {burl: this.router.url} });


    }

    onRevenueClick(): void {

      this.router.navigate([ '/revenue/create' ], { queryParams: {burl: this.router.url} });


    }


}
