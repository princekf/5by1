import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxService } from '@fboservices/inventory/tax.service';
import { Tax } from '@shared/entity/inventory/tax';
import { MainService } from '@fboservices/main.service';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-delete-tax',
  templateUrl: './delete-tax.component.html',
  styleUrls: [ './delete-tax.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteTaxComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

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

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
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

  deleteTaxes(): void {

    this.loading = true;
    const taxes = this.dataSource.data;
    const tIds = [];
    taxes.forEach((taxP) => tIds.push(taxP.id));
    this.taxService.deleteByIds(tIds).subscribe((taxesP) => {

      this.loading = false;
      this.toastr.success('Taxes are deleted successfully', 'Tax deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting taxes', 'Tax not deleted');
      console.error(error);

    });

  }

}
