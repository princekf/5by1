import { Component, OnInit } from '@angular/core';
import { RevenueService} from '@fboservices/inventory/revenue.service';
import { MainService } from '@fboservices/main.service';
import { Revenue} from '@shared/entity/inventory/revenue';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { QueryData } from '@shared/util/query-data';
@Component({
  selector: 'app-delete-revenue',
  templateUrl: './delete-revenue.component.html',
  styleUrls: [ './delete-revenue.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteRevenueComponent implements OnInit {


  displayedColumns: string[] = [ 'receivedDate', 'customer.name', 'invoice.invoiceNumber', 'bank.name', 'category', 'amount', 'description' ];

  columnHeaders = {
    receivedDate: 'Received Date',
    'customer.name': 'Customer',
    'invoice.invoiceNumber': 'Invoice',
    'bank.name': 'Bank',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',

  }

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Revenue>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly revenueService:RevenueService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }


  columnParsingFn = (element:unknown, column:string): string => {


    switch (column) {

    case 'receivedDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      include: [
        {relation: 'customer'}, {relation: 'invoice'}, {relation: 'bank'}
      ],
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.revenueService.search(queryData).subscribe((revenues) => {

      this.dataSource.data = revenues;
      this.loading = false;

    });

  }

  ngAfterViewInit():void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }

  deleteRevenue(): void {

    this.loading = true;
    const revenues = this.dataSource.data;
    const tIds = [];
    revenues.forEach((revenueP) => tIds.push(revenueP.id));
    const where = {id: {
      inq: tIds
    }};
    this.revenueService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} revenues are deleted successfully`, 'Revenues deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Revenues', 'Revenue not deleted');
      console.error(error);

    });

  }

}
