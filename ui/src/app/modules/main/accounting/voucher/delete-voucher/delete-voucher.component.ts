import { Component, OnInit } from '@angular/core';
import { MainService } from '@fboservices/main.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';

import { Voucher } from '@shared/entity/accounting/voucher';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';

@Component({
  selector: 'app-delete-voucher',
  templateUrl: './delete-voucher.component.html',
  styleUrls: [ './delete-voucher.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteVoucherComponent implements OnInit {

  displayedColumns: string[] = [ 'number', 'date', 'type', 'details' ];


  columnHeaders = {
    number: 'Number',
    date: 'Date',
    type: 'Type',
    details: 'Details',

  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Voucher>([]);

  findColumnValue = _findColumnValue;

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {

    case 'finYearStartDate':
      return dayjs(element[column]).format(environment.dateFormat);


    }
    return null;

  }


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly voucherService: VoucherService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.voucherService.search(queryData).subscribe((voucher) => {

      this.dataSource.data = voucher;
      this.loading = false;

    });

  }

  ngAfterViewInit(): void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }

  deleteVouchers(): void {

    this.loading = true;
    const voucher = this.dataSource.data;
    const tIds = [];
    voucher.forEach((voucherP) => tIds.push(voucherP.id));
    const where = {id: {
      inq: tIds
    }};

    this.voucherService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} vouchers are deleted successfully`, 'vouchers deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting vouchers', 'voucher not deleted');
      console.error(error);

    });

  }


}
