import { Component, OnInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { Voucher } from '@shared/entity/accounting/voucher';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { TransactionService } from '@fboservices/accounting/transaction.service';
import { Transaction } from '@shared/entity/accounting/transaction';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterVoucherComponent } from '../filter-voucher/filter-voucher.component';


@Component({
  selector: 'app-list-voucher',
  templateUrl: './list-voucher.component.html',
  styleUrls: [ './list-voucher.component.scss' ]
})
export class ListVoucherComponent implements OnInit {


  displayedColumns: string[] = [ 'number', 'date', 'type', 'details' ];

  columnHeaders = {
    number: 'Number',
    date: 'Date',
    type: 'Type',
    details: 'Details',

  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  vouchers:ListQueryRespType<Voucher> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  transactions: Array<Transaction> =[];

  filterItem: FilterItem;


  columnParsingFn = (element:unknown, column:string): string => {


    switch (column) {

    case 'date':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly voucherService:VoucherService,
    private readonly transactionService:TransactionService,
  ) { }


  private loadData = () => {

    this.loading = true;


    this.voucherService.list(this.queryParams).subscribe((voucher) => {

      this.vouchers = voucher;
      this.loading = false;

    }, (error) => {

      this.loading = false;

    });


  };


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterVoucherComponent, {});

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
