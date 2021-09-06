import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { PaymentService} from '@fboservices/inventory/payment.service';
import { MainService } from '@fboservices/main.service';
import { Payment} from '@shared/entity/inventory/payment';
@Component({
  selector: 'app-delete-payment',
  templateUrl: './delete-payment.component.html',
  styleUrls: [ './delete-payment.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeletePaymentComponent implements OnInit {


  displayedColumns: string[] = [ 'paidDate', 'vendor.name', 'bill.billNumber', 'bank.name', 'category', 'amount', 'description' ];

  columnHeaders = {
    paidDate: 'Paid Date',
    'vendor.name': 'Vendor',
    'bill.billNumber': 'Bill',
    'bank.name': 'Bank',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',

  }

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Payment>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly paymentService:PaymentService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }


  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.paymentService.listByIds(tIdArray).subscribe((payments) => {

      this.dataSource.data = payments;
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

  deletePayment(): void {

    this.loading = true;
    const payments = this.dataSource.data;
    const tIds = [];
    payments.forEach((paymentP) => tIds.push(paymentP.id));
    this.paymentService.deleteByIds(tIds).subscribe((paymentP) => {

      this.loading = false;
      this.toastr.success('Payments are deleted successfully', 'Payments deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Payments', 'Payment not deleted');
      console.error(error);

    });

  }

}
