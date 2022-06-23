import { Component, AfterViewInit, OnInit } from '@angular/core';
import { RevenueService } from '@fboservices/inventory/revenue.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Revenue } from '@shared/entity/inventory/revenue';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterRevenueComponent } from '../filter-revenue/filter-revenue.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';

@Component({
  selector: 'app-list-revenue',
  templateUrl: './list-revenue.component.html',
  styleUrls: [ './list-revenue.component.scss' ]
})
export class ListRevenueComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Revenues';

  displayedColumns: string[] = [ 'receivedDate', 'customer.name', 'invoice.invoiceNumber', 'bank.name',
    'category', 'amount', 'description' ];

  c = this.displayedColumns.length;

  numberColumns: string[] = [ 'amount' ];

  columnHeaders = {
    receivedDate: 'Received Date',
    'customer.name': 'Customer',
    'invoice.invoiceNumber': 'Invoice',
    'bank.name': 'Bank',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',

  };

  xheaders = [
    {key: 'receivedDate',
      width: 25 },
    {key: 'customer.name',
      width: 30 },
    {key: 'invoice.invoiceNumber',
      width: 20 },
    {key: 'bank.name',
      width: 20 },
    {key: 'category',
      width: 25 },
    {key: 'amount',
      width: 25 },
    {key: 'description',
      width: 30 },
  ];

  iheaders = [
    'Received Date',
    'Customer',
    'Invoice',
    'Bank',
    'Category',
    'Amount',
    'Description',

  ];


  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  revenues: ListQueryRespType<Revenue> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'receivedDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(private activatedRoute: ActivatedRoute,
              private revenueService: RevenueService,
              private dialog: MatDialog,
              private mainservice: MainService,) { }


    private loadData = () => {

      this.loading = true;
      this.queryParams.include = [
        {relation: 'customer'}, {relation: 'invoice'}, {relation: 'bank'}
      ];
      this.revenueService.list(this.queryParams).subscribe((revenues) => {

        this.revenues = revenues;

        this.loading = false;


      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterRevenueComponent, {});

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

    exportExcel(): void {


      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.revenues.items, headers);


    }


}
