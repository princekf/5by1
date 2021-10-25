import { Component, OnInit } from '@angular/core';

import { MainService } from '@fboservices/main.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
import { UserService } from '@fboservices/user.service';

import { User } from '@shared/entity/auth/user';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: [ './delete-user.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteUserComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'email', 'role' ];


  columnHeaders = {
    name: 'Name',
    email: 'Email',
    role: 'Role',

  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<User>([]);

  findColumnValue = _findColumnValue;


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly userService: UserService,
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
    this.userService.search(queryData).subscribe((user) => {

      this.dataSource.data = user;
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

  deleteUsers(): void {

    this.loading = true;
    const finyears = this.dataSource.data;
    const tIds = [];
    finyears.forEach((userP) => tIds.push(userP.id));
    const where = {id: {
      inq: tIds
    }};

    this.userService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Users are deleted successfully`, 'User deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Users', 'User not deleted');
      console.error(error);

    });

  }

}
