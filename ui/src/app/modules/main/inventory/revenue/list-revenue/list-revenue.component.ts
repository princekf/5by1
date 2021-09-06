import { Component} from '@angular/core';
import { RevenueService } from '@fboservices/inventory/revenue.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Revenue } from '@shared/entity/inventory/revenue';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
@Component({
  selector: 'app-list-revenue',
  templateUrl: './list-revenue.component.html',
  styleUrls: [ './list-revenue.component.scss' ]
})
export class ListRevenueComponent {

  displayedColumns: string[] = [ 'receivedDate', 'customer.name', 'invoice.invoiceNumber', 'bank.name', 'category', 'amount', 'description' ];

  columnHeaders = {
    receivedDate: 'ReceivedDate',
    'customer.name': 'Customer',
    'invoice.invoiceNumber': 'Invoice',
    'bank.name': 'Bank',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',

  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  revenues:ListQueryRespType<Revenue> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {

    case 'receivedDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(private activatedRoute : ActivatedRoute,
    private revenueService:RevenueService) { }


    private loadData = () => {

      this.loading = true;
      this.revenueService.list(this.queryParams).subscribe((revenues) => {

        this.revenues = revenues;

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
