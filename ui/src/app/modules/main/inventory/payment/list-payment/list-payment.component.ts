import { Component} from '@angular/core';
import { PaymentService } from '@fboservices/inventory/payment.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Payment } from '@shared/entity/inventory/payment';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterPaymentComponent } from '../filter-payment/filter-payment.component';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: [ './list-payment.component.scss' ]
})
export class ListPaymentComponent {

  displayedColumns: string[] = [ 'paidDate', 'vendor.name', 'bill.billNumber', 'bank.name', 'category', 'amount', 'description' ];

  columnHeaders = {
    paidDate: 'Paid Date',
    'vendor.name': 'Vendor',
    'bill.billNumber': 'Bill',
    'bank.name': 'Bank',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',

  }


  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  payments:ListQueryRespType<Payment> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  columnParsingFn = (element:unknown, column:string) : string => {

    switch (column) {

    case 'paidDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }


  constructor(
    private activatedRoute : ActivatedRoute,
    private paymentService:PaymentService
  ) { }


  private loadData = () => {

    this.loading = true;
    this.queryParams.include = [
      {relation: 'vendor'}, {relation: 'bill'}, {relation: 'bank'}
    ];
    this.paymentService.list(this.queryParams).subscribe((payments) => {

      this.payments = payments;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  };

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterPaymentComponent, {});

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
