import { Component} from '@angular/core';
import { PaymentService } from '@fboservices/inventory/payment.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Payment } from '@shared/entity/inventory/payment';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private activatedRoute : ActivatedRoute,
    private paymentService:PaymentService
  ) { }


  private loadData = () => {

    this.loading = true;
    this.paymentService.list(this.queryParams).subscribe((payments) => {

      this.payments = payments;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  };

  ngAfterViewInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };
      this.loadData();

    });


  }

}
