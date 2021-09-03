import { Component, OnInit } from '@angular/core';
import { BillService} from '@fboservices/inventory/bill.service';
import { MainService } from '@fboservices/main.service';
import { Bill} from '@shared/entity/inventory/bill';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-delete-bill',
  templateUrl: './delete-bill.component.html',
  styleUrls: [ './delete-bill.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteBillComponent implements OnInit {


  displayedColumns: string[] = [ 'vendor.name', 'billDate', 'billNumber', 'totalAmount', 'totalDisount', 'totalTax', 'grandTotal', 'isPaid' ];

  columnHeaders = {
    'vendor.name': 'Vendor',
    billDate: 'Bill Date',
    billNumber: 'bill Number #',
    totalAmount: 'Amount',
    totalDisount: 'Discount',
    totalTax: 'Tax',
    grandTotal: 'Grand Total',
    isPaid: 'Paid'
  }


  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Bill>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly billService:BillService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.billService.listByIds(tIdArray).subscribe((bills) => {

      this.dataSource.data = bills;

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

  deleteBill(): void {

    this.loading = true;
    const categories = this.dataSource.data;
    const tIds = [];
    categories.forEach((billP) => tIds.push(billP._id));
    this.billService.deleteByIds(tIds).subscribe((billP) => {

      this.loading = false;
      this.toastr.success('Bills are deleted successfully', 'Bills deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Bills', 'bill not deleted');
      console.error(error);

    });

  }

}
