import { Vendor } from '@shared/entity/inventory/vendor';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-delete-vendor',
  templateUrl: './delete-vendor.component.html',
  styleUrls: [ './delete-vendor.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteVendorComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Vendor>([]);

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

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly vendorService:VendorService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService) { }

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
    this.vendorService.search(queryData).subscribe((items) => {

      this.dataSource.data = items;
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
    this.router.navigate([ '/vendor' ], {queryParams: uParams});

  }

  deleteItems(): void {

    this.loading = true;
    const units = this.dataSource.data;
    const tIds = [];
    units.forEach((itemP) => tIds.push(itemP.id));
    const where = {id: {
      inq: tIds
    }};
    this.vendorService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} vendors are deleted successfully`, 'Vendor deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting customers', 'Customer not deleted');
      console.error(error);

    });

  }

}
