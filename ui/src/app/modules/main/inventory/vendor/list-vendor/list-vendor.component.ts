import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterVendorComponent } from '../filter-vendor/filter-vendor.component';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-vendor',
  templateUrl: './list-vendor.component.html',
  styleUrls: [ './list-vendor.component.scss' ]
})
export class ListVendorComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Vendors';

  displayedColumns: string[] = [ 'name', 'email', 'mobile', 'state', 'address', 'gstNo' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    email: 'E-Mail',
    mobile: 'Mobile',
    state: 'State',
    address: 'Address',
    gstNo: 'GST No'
  };

  xheaders = [
    {key: 'name',
      width: 30, },
    { key: 'email',
      width: 45 },
    {key: 'mobile',
      width: 20 },
    {key: 'state',
      width: 15 },
    {key: 'address',
      width: 45 },
    {key: 'gstNo',
      width: 20 }
  ];

   iheaders = [
     'Name',
     'E-Mail',
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
    private readonly vendorService: VendorService,
    private dialog: MatDialog,
    private mainservice: MainService,) { }

    private loadData = () => {

      this.loading = true;
      this.vendorService.list(this.queryParams).subscribe((rawDatas) => {

        this.rawDatas = rawDatas;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterVendorComponent, {});

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
      this.vendorService.queryData(tParams).subscribe((items) => {

        items.forEach((element) => {

          const temp = [ element.name, element.email, element.mobile, element.state, element.address, element.gstNo ];

          data.push(temp);

        });
        const result = {
          cell: this.c,
          rheader: this.iheaders,
          eheader: this.xheaders,
          header: this.columnHeaders,
          rowData: data
        };
        this.mainservice.setExport(result);

        this.dialog.open(ExportPopupComponent, {height: '500px',
          data: {items,
            displayedColumns: this.displayedColumns,
            columnHeaders: this.columnHeaders}});
        this.loading = false;


      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    exportExcel() : void {

      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.rawDatas.items, headers);

    }

}
