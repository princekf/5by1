import { Component } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { InvoiceService } from '@fboservices/inventory/invoice.service';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { Invoice } from '@shared/entity/inventory/invoice';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: [ './list-invoice.component.scss' ]
})
export class ListInvoiceComponent {

  displayedColumns: string[] = [ 'customer.name', 'invoiceDate', 'invoiceNumber', 'totalAmount', 'totalDisount', 'totalTax', 'grandTotal', 'isReceived' ];

  columnHeaders = {
    'customer.name': 'Customer',
    invoiceDate: 'Date',
    invoiceNumber: 'Invoice #',
    totalAmount: 'Amount',
    totalDisount: 'Discount',
    totalTax: 'Tax',
    grandTotal: 'Grand Total',
    isReceived: 'Received'
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  invoices:ListQueryRespType<Invoice> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {

    case 'isReceived':
      return element[column] ? 'Yes' : 'No';
    case 'invoiceDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly invoiceService:InvoiceService) { }

    private loadData = () => {

      this.loading = true;
      this.invoiceService.list(this.queryParams).subscribe((invoices) => {

        this.invoices = invoices;
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
