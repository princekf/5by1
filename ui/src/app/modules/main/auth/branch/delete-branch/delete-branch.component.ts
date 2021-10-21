import { Component, OnInit } from '@angular/core';

import { MainService } from '@fboservices/main.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';

import { Branch } from '@shared/entity/auth/branch';
import { BranchService } from '@fboservices/auth/branch.service';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';

@Component({
  selector: 'app-delete-branch',
  templateUrl: './delete-branch.component.html',
  styleUrls: [ './delete-branch.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteBranchComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'email', 'address', 'finYearStartDate', 'defaultFinYear.name' ];


  columnHeaders = {
    name: 'Name',
    email: 'Email',
    address: 'Address',
    finYearStartDate: 'FinYearStartDate',
    'defaultFinYear.name': 'DefaultFinYear'
  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Branch>([]);

  findColumnValue = _findColumnValue;

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {

    case 'finYearStartDate':
      return dayjs(element[column]).format(environment.dateFormat);


    }
    return null;

  }

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly branchService: BranchService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      include: [
        {relation: 'defaultFinYear'}
      ],
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.branchService.search(queryData).subscribe((branch) => {

      this.dataSource.data = branch;
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

  deleteBranchs(): void {

    this.loading = true;
    const companies = this.dataSource.data;
    const tIds = [];
    companies.forEach((branchP) => tIds.push(branchP.id));
    const where = {id: {
      inq: tIds
    }};

    this.branchService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Branchs are deleted successfully`, 'Branchs deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Branchs', 'Company not deleted');
      console.error(error);

    });

  }

}
