import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TransferService } from '@fboservices/inventory/transfer.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Transfer } from '@shared/entity/inventory/transfer';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterTransferComponent } from '../filter-transfer/filter-transfer.component';
@Component({
  selector: 'app-list-transfer',
  templateUrl: './list-transfer.component.html',
  styleUrls: [ './list-transfer.component.scss' ]
})
export class ListTransferComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = [ 'fromAccount.name', 'toAccount.name', 'transferDate', 'amount', 'description', ];

  columnHeaders = {
    'fromAccount.name': 'From Account',
    'toAccount.name': 'To Account',
    transferDate: 'Transfer Date',
    amount: 'Amount',
    description: 'Description',

  };

  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  transfers: ListQueryRespType<Transfer> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'transferDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(private transferService: TransferService,
              private activatedRoute: ActivatedRoute
  ) { }


  private loadData = () => {

    this.loading = true;
    this.queryParams.include = [
      {relation: 'fromAccount'},
      {relation: 'toAccount'}
    ];
    this.transferService.list(this.queryParams).subscribe((transfers) => {

      this.transfers = transfers;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterTransferComponent, {});

  }

  ngAfterViewInit(): void {

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
