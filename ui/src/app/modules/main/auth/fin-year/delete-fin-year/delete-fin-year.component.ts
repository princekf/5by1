import { Component, OnInit } from '@angular/core';

import { MainService } from '@fboservices/main.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
import { FinYearService } from '@fboservices/auth/fin-year.service';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { FinYear } from '@shared/entity/auth/fin-year';

@Component({
  selector: 'app-delete-fin-year',
  templateUrl: './delete-fin-year.component.html',
  styleUrls: [ './delete-fin-year.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteFinYearComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'email', 'startDate', 'endDate', 'branch.name' ];


  columnHeaders = {
    name: 'Name',
    startDate: 'StartDate',
    endDate: 'EndDate',
    'branch.name': 'Branch'
  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<FinYear>([]);

  findColumnValue = _findColumnValue;

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {

    case 'startDate':
      return dayjs(element[column]).format(environment.dateFormat);

    case 'endDate':
      return dayjs(element[column]).format(environment.dateFormat);


    }
    return null;

  }

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly finYearService: FinYearService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      include: [
        {relation: 'branch'}
      ],
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.finYearService.search(queryData).subscribe((finyear) => {

      this.dataSource.data = finyear;
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

  deleteCompanys(): void {

    this.loading = true;
    const finyears = this.dataSource.data;
    const tIds = [];
    finyears.forEach((finyearP) => tIds.push(finyearP.id));
    const where = {id: {
      inq: tIds
    }};

    this.finYearService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Fin-years are deleted successfully`, 'Fin-year deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Fin-years', 'Fin-year not deleted');
      console.error(error);

    });

  }

}
