import { Component, AfterViewInit, OnInit } from '@angular/core';
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
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: [ './list-payment.component.scss' ]
})
export class ListPaymentComponent implements AfterViewInit, OnInit  {

  displayedColumns: string[] = [ 'paidDate', 'vendor.name', 'bill.billNumber',
    'bank.name', 'category', 'amount', 'description' ];

  numberColumns: string[] = [ 'amount' ];

  columnHeaders = {
    paidDate: 'Paid Date',
    'vendor.name': 'Vendor',
    'bill.billNumber': 'Bill',
    'bank.name': 'Bank',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',

  };
  xheaders = [
    {key: 'paidDate' , width: 25 },
    {key: 'vendor.name' ,  width: 20 },
    {key: 'bill.billNumber' , width: 20 },
    {key: 'bank.name' , width: 20 },
    {key: 'category' , width: 20 },
    { key: 'amount' , width: 15 },
    {key: 'description' , width: 35 },

  ];


  iheaders = [
     'Paid Date',
     'Vendor',
     'Bill',
     'Bank',
     'Category',
     'Amount',
     'Description',

  ];


  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  payments: ListQueryRespType<Payment> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'paidDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private mainservice: MainService,
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

  }

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterPaymentComponent, {});

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
    tParams.limit = this.payments.totalItems;
    this.loading = true;
    const data = [];
    this.paymentService.queryData(tParams).subscribe((items) => {

      items.forEach((element: any) => {
        const temp = [element.paidDate, element.vendor?.name, element.bill?.billNumber, element.bank?.name,
          element.category, element.amount, element.description];

        data.push(temp);
    });
      const result = {
        rheader: this.iheaders,
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
