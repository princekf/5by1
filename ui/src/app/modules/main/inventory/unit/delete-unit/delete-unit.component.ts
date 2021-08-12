import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { MainService } from '@fboservices/main.service';
import { Unit } from '@shared/entity/inventory/unit';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-unit',
  templateUrl: './delete-unit.component.html',
  styleUrls: [ './delete-unit.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeleteUnitComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'code', 'decimalPlaces', 'parent.name', 'times', 'description' ];

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Unit>([]);

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    decimalPlaces: 'Decimals',
    'parent.name': 'Parent',
    description: 'Description',
    times: 'Times'
  }

  loading = true;

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
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


  goToUnits(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/unit' ], {queryParams: uParams});

  }

  deleteUnits(): void {

    this.loading = true;
    const units = this.dataSource.data;
    const tIds = [];
    units.forEach((taxP) => tIds.push(taxP._id));
    this.unitService.deleteByIds(tIds).subscribe((unitsP) => {

      this.loading = false;
      this.toastr.success('Units are deleted successfully', 'Unit deleted');
      this.goToUnits();

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting units', 'Unit not deleted');
      console.error(error);

    });

  }

  findColumnValue = (element:unknown, column:string):string => <string> column.split('.').reduce((acc, cur) => acc[cur] ?? '', element);


}
