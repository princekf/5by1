import { Component, Input} from '@angular/core';
import { RevenueService } from '@fboservices/inventory/revenue.service';
import { PaymentService } from '@fboservices/inventory/payment.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { fboTableRowExpandAnimation } from '@fboutil/fbo.util';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: [ './list-transaction.component.scss', '../../../../../util/styles/fbo-form-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class ListTransactionComponent {

  displayedColumns: string[] = [ 'date', 'PartyName', 'bill/invoiceNumber', 'bank', 'category', 'Amount', 'description' ];

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  mainHeader= 'Transaction';

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


  transaction:ListQueryRespType<unknown> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  @Input() createUri: string;

  dataSource = new MatTableDataSource<unknown>();


  constructor(private activatedRoute : ActivatedRoute,
    private revenueService:RevenueService,
    private paymentService:PaymentService,
    private readonly router: Router,
    public readonly route: ActivatedRoute,
  ) { }


    private loadData = () => {

      this.loading = true;


      this.revenueService.list(this.queryParams).subscribe((revenues) => {

        this.revenues = revenues;
        this.paymentService.list(this.queryParams).subscribe((payments) => {

          this.payments = payments;


          for (let index = 0; index < this.payments.items.length; index ++) {

            this.revenues.items.push(this.payments.items[index]);


          }


          this.transaction = revenues;

          this.dataSource = new MatTableDataSource<unknown>(revenues.items);


          this.loading = false;


        }, (error) => {

          console.error(error);
          this.loading = false;

        });

      });


    }

    ngAfterViewInit():void {

      this.activatedRoute.queryParams.subscribe((value) => {

        this.queryParams = { ...value };
        this.loadData();

      });


    }


    onPaymentClick(): void {

      this.router.navigate([ '/payment/create' ], { queryParams: {burl: this.router.url} });


    }

    onRevenueClick(): void {

      this.router.navigate([ '/revenue/create' ], { queryParams: {burl: this.router.url} });


    }


}
