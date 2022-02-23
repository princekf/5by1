import { Component, AfterViewInit, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Subscription } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterCustomerComponent } from '../filter-customer/filter-customer.component';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';


@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: [ './list-customer.component.scss' ]
})
export class ListCustomerComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = [ 'name', 'email', 'mobile', 'state', 'address', 'gstNo' ];
  c = this.displayedColumns.length;
  columnHeaders = {
    name: 'Name',
    email: 'EMail',
    mobile: 'Mobile',
    state: 'State',
    address: 'Address',
    gstNo: 'GST No'
  };
  xheaders = [
    { key: 'name', width: 30, },
    {  key: 'eMail', width: 35 },
    {  key: 'mobile', width: 19 },
    {  key: 'state', width: 20 },
    {  key: 'address', width: 40 },
    {  key: 'gstNo', width: 25 }
  ];
  iheaders = [
     'Name',
  'EMail',
   'Mobile',
     'State',
    'Address',
   'GST No'
  ];

  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  rawDatas: ListQueryRespType<Customer> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService,
    private dialog: MatDialog,
    private mainservice: MainService, ) { }

    private loadData = () => {

      this.loading = true;
      this.customerService.list(this.queryParams).subscribe((rawDatas) => {

        this.rawDatas = rawDatas;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterCustomerComponent, {});

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
    tParams.limit = this.rawDatas.totalItems;
    this.loading = true;
    const data = [];
    this.customerService.queryData(tParams).subscribe((items) => {

      items.forEach((element: any) => {
        const temp = [ element.name, element.email, element.mobile, element.state, element.address, element.gstNo];

        data.push(temp);
    });
      const result = {
        cell:this.c,
      eheader: this.xheaders,
      rheader: this.iheaders,
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
