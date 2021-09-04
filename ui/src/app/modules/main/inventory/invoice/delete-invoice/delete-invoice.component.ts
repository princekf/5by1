import { Component, OnInit } from '@angular/core';
import { InvoiceService} from '@fboservices/inventory/invoice.service';
import { MainService } from '@fboservices/main.service';
import { Invoice} from '@shared/entity/inventory/invoice';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-delete-invoice',
  templateUrl: './delete-invoice.component.html',
  styleUrls: [ './delete-invoice.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteInvoiceComponent implements OnInit {

  displayedColumns: string[] = [ 'customer.name', 'invoiceDate', 'invoiceNumber', 'totalAmount', 'totalDisount', 'totalTax', 'grandTotal', 'isReceived' ];

  columnHeaders = {
    'customer.name': 'Customer',
    invoiceDate: 'Date',
    invoiceNumber: 'Invoice #',
    totalAmount: 'Amount',
    totalDisount: 'Discount',
    totalTax: 'Tax',
    grandTotal: 'Grand Total',
    isReceived: 'Received'
  }

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Invoice>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly invoiceService:InvoiceService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.invoiceService.listByIds(tIdArray).subscribe((invoices) => {

      this.dataSource.data = invoices;

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

  deleteInvoice(): void {

    this.loading = true;
    const invoices = this.dataSource.data;
    const tIds = [];
    invoices.forEach((invoiceP) => tIds.push(invoiceP._id));
    this.invoiceService.deleteByIds(tIds).subscribe((invoiceP) => {

      this.loading = false;
      this.toastr.success('Invoices are deleted successfully', 'Invoices deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Invoices', 'Invoice not deleted');
      console.error(error);

    });

  }

}
