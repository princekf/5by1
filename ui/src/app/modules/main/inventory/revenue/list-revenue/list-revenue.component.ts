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
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';

@Component({
  selector: 'app-list-revenue',
  templateUrl: './list-revenue.component.html',
  styleUrls: [ './list-revenue.component.scss' ]
})
export class ListRevenueComponent implements AfterViewInit, OnInit  {

  displayedColumns: string[] = [ 'receivedDate', 'customer.name', 'invoice.invoiceNumber', 'bank.name',
  'category', 'amount', 'description' ];

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
    { header: 'Received Date', key: 'Received Date', width: 25 },
    { header: 'Customer', key: 'Customer', width: 30 },
    { header: 'Invoice', key: 'Invoice', width: 20 },
    { header: 'Bank', key: 'Bank', width: 20 },
    { header: 'Category', key: 'Category', width: 25 },
    { header: 'Amount', key: 'Amount', width: 25 },
    { header: 'Description', key: 'Description', width: 30 },
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
              private mainservice: MainService, ) { }


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

  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.revenues.totalItems;
    this.loading = true;
    const data = [];
    this.revenueService.queryData(tParams).subscribe((items) => {

      items.forEach((element: any) => {
        const temp = [element.receivedDate, element.customer?.name, element.invoice?.invoiceNumber,
           element.bank?.name, element.category, element.amount,
          element.description];

        data.push(temp);
    });
      const result = {
      eheader: this.xheaders,
      header: this.columnHeaders,
      rowData: data
    };
      this.mainservice.setExport(result);

      this.dialog.open(ExportPopupComponent, {
        height: '500px',
        data: {items,
          displayedColumns: this.displayedColumns,
          columnHeaders: this.columnHeaders}});
      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


}
