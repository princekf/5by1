import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { TaxService } from '@fboservices/inventory/tax.service';
import { Tax } from '@shared/entity/inventory/tax';
import { HttpParams } from '@angular/common/http';
import { MainService } from '@fboservices/main.service';
import { ToastrService } from 'ngx-toastr';
import { findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
@Component({
  selector: 'app-delete-tax',
  templateUrl: './delete-tax.component.html',
  styleUrls: [ './delete-tax.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeleteTaxComponent implements OnInit {

  displayedColumns: string[] = [ 'groupName', 'name', 'rate', 'appliedTo', 'description' ];

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Tax>([]);

  columnHeaders = {
    groupName: 'Group Name',
    name: 'Name',
    rate: 'Rate (%)',
    appliedTo: 'Applied To (%)',
    description: 'Description'
  }

  loading = true;

  findColumnValue = _findColumnValue;

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly taxService:TaxService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.taxService.listByIds(tIdArray).subscribe((taxes) => {

      this.dataSource.data = taxes;
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

  goToTaxes(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/tax' ], {queryParams: uParams});

  }

  deleteTaxes(): void {

    this.loading = true;
    const taxes = this.dataSource.data;
    const tIds = [];
    taxes.forEach((taxP) => tIds.push(taxP._id));
    this.taxService.deleteByIds(tIds).subscribe((taxesP) => {

      this.loading = false;
      this.toastr.success('Taxes are deleted successfully', 'Tax deleted');
      this.goToTaxes();

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting taxes', 'Tax not deleted');
      console.error(error);

    });

  }

}
