import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { MainService } from '@fboservices/main.service';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import { Customer } from '@shared/entity/inventory/customer';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: [ './delete-customer.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeleteCustomerComponent implements OnInit {

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Customer>([]);

  displayedColumns: string[] = [ 'name', 'email', 'mobile', 'state', 'address', 'gstNo' ];

  columnHeaders = {
    name: 'Name',
    email: 'E-Mail',
    mobile: 'Mobile',
    state: 'State',
    address: 'Address',
    gstNo: 'GST No'
  }

  loading = true;

  findColumnValue = _findColumnValue;

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly customerService:CustomerService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.customerService.listByIds(tIdArray).subscribe((units) => {

      this.dataSource.data = units;
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


  goToCustomers(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/customer' ], {queryParams: uParams});

  }

  deleteUnits(): void {

    this.loading = true;
    const units = this.dataSource.data;
    const tIds = [];
    units.forEach((taxP) => tIds.push(taxP._id));
    this.customerService.deleteByIds(tIds).subscribe((unitsP) => {

      this.loading = false;
      this.toastr.success('Customers are deleted successfully', 'Customer deleted');
      this.goToCustomers();

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting customers', 'Customer not deleted');
      console.error(error);

    });

  }

}
