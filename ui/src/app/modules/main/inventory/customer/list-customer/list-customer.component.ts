import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Customer } from '@shared/entity/inventory/customer';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterCustomerComponent } from '../filter-customer/filter-customer.component';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';


@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: [ './list-customer.component.scss' ]
})
export class ListCustomerComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Customers';

  displayedColumns: string[] = [ 'name', 'email', 'mobile', 'state', 'address', 'gstNo' ];

  columnHeaders = {
    name: 'Name',
    email: 'EMail',
    mobile: 'Mobile',
    state: 'State',
    address: 'Address',
    gstNo: 'GST No'
  };

  queryParams: QueryData = {};

  loading = true;

  rawDatas: ListQueryRespType<Customer> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService) { }

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

    exportExcel() : void {

      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.rawDatas.items, headers);

    }

}
