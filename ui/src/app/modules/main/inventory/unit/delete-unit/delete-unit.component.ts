import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { MainService } from '@fboservices/main.service';
import { Unit } from '@shared/entity/inventory/unit';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-delete-unit',
  templateUrl: './delete-unit.component.html',
  styleUrls: [ './delete-unit.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteUnitComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  displayedColumns: string[] = [ 'name', 'code', 'decimalPlaces', 'parent.name', 'times', 'description' ];

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Unit>([]);

  displayedColumns: string[] = [ 'name', 'code', 'decimalPlaces', 'parent.name', 'times', 'description' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    decimalPlaces: 'Decimals',
    'parent.name': 'Base Unit',
    description: 'Description',
  }

  loading = true;

  findColumnValue = _findColumnValue;

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly unitService:UnitService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.unitService.listByIds(tIdArray).subscribe((units) => {

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

  deleteUnits(): void {

    this.loading = true;
    const units = this.dataSource.data;
    const tIds = [];
    units.forEach((taxP) => tIds.push(taxP.id));
    this.unitService.deleteByIds(tIds).subscribe((unitsP) => {

      this.loading = false;
      this.toastr.success('Units are deleted successfully', 'Unit deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting units', 'Unit not deleted');
      console.error(error);

    });

  }

}
