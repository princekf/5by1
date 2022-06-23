import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { InvoiceService } from '@fboservices/inventory/invoice.service';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { Invoice } from '@shared/entity/inventory/invoice';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterInvoiceComponent } from '../filter-invoice/filter-invoice.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: [ './list-invoice.component.scss' ]
})
export class ListInvoiceComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Invoices';

  displayedColumns: string[] = [ 'customer.name', 'invoiceDate', 'invoiceNumber', 'totalAmount', 'totalDiscount', 'totalTax', 'grandTotal', 'isReceived' ];

  c = this.displayedColumns.length;

numberColumns: string[] = [ 'totalAmount' ];

  columnHeaders = {
    'customer.name': 'Customer',
    invoiceDate: 'Date',
    invoiceNumber: 'Invoice #',
    totalAmount: 'Amount',
    totalDiscount: 'Discount',
    totalTax: 'Tax',
    grandTotal: 'Grand Total',
    isReceived: 'Received'
  };

  xheaders = [
    {key: 'customer.name',
      width: 30, },
    {key: 'invoiceDate',
      width: 15 },
    {key: 'invoiceNumber',
      width: 20 },
    {key: 'totalAmount',
      width: 20 },
    { key: 'totalDiscount',
      width: 20 },
    { key: 'totalTax',
      width: 15 },
    {key: 'grandTotal',
      width: 25 },
    { key: 'isReceived',
      width: 25 }

  ];

  iheaders = [
    'Customer',
    'Date',
    'Invoice #',
    'Amount',
    'Discount',
    'Tax',
    'Grand Total',
    'Received'
  ];


  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  invoices: ListQueryRespType<Invoice> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'isReceived':
      return element[column] ? 'Yes' : 'No';
    case 'invoiceDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly invoiceService: InvoiceService,
    private dialog: MatDialog,
    private mainservice: MainService,) { }

    private loadData = () => {

      this.loading = true;
      this.queryParams.include = [
        {relation: 'customer'}
      ];
      this.invoiceService.list(this.queryParams).subscribe((invoices) => {

        this.invoices = invoices;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterInvoiceComponent, {});

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

    exportExcel() : void {

      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.invoices.items, headers);

    }

}
