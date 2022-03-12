import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';

import { CostCentre } from '@shared/entity/accounting/cost-centre';
import { CostCentreService } from '@fboservices/accounting/cost-centre.service';
import { MainService } from '@fboservices/main.service';

@Component({
  selector: 'app-delete-cost-centre',
  templateUrl: './delete-cost-centre.component.html',
  styleUrls: [ './delete-cost-centre.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteCostCentreComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'details' ];


  columnHeaders = {
    name: 'Name',

    details: 'Details',

  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<CostCentre>([]);

  findColumnValue = _findColumnValue;


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly costCentreService: CostCentreService,
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
    this.costCentreService.search(queryData).subscribe((costCentre) => {

      this.dataSource.data = costCentre;
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

  deleteCostCentres(): void {

    this.loading = true;
    const CostCentres = this.dataSource.data;
    const tIds = [];
    CostCentres.forEach((CostCentreP) => tIds.push(CostCentreP.id));
    const where = {id: {
      inq: tIds
    }};

    this.costCentreService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} CostCentres are deleted successfully`, 'CostCentres deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting CostCentres', 'CostCentre not deleted');
      console.error(error);

    });

  }

}
