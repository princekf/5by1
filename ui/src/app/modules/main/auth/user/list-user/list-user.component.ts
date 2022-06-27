import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '@fboservices/user.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterUserComponent } from '../filter-user/filter-user.component';
import { User } from '@shared/entity/auth/user';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: [ './list-user.component.scss' ]
})
export class ListUserComponent implements OnInit, AfterViewInit {

  tableHeader = 'List of Users';

  displayedColumns: string[] = [ 'name', 'email', 'role' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    email: 'Email',
    role: 'Role',
  };

    iheaders = [
      'Name',
      'Email',
      'Role',
    ];


  xheaders = [
    {key: 'name',
      width: 40 },
    { key: 'email',
      width: 50 },
    { key: 'role',
      width: 10 },

  ];


  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  Users: ListQueryRespType<User> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private dialog: MatDialog,
              private mainservice: MainService,) { }


  private loadData = () => {

    this.loading = true;

    this.userService.list(this.queryParams).subscribe((user) => {

      this.Users = user;


      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterUserComponent, {});

  }

  ngAfterViewInit(): void {

    this.activatedRoute.queryParams.subscribe((value) => {

      const {whereS, ...qParam} = value;
      this.queryParams = qParam;
      if (whereS) {

        this.queryParams.where = JSON.parse(whereS);

      }

      this.loadData();


    });

  }

  exportExcel() : void {

    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));

    exportAsXLSX(this.tableHeader, this.Users.items, headers);

  }

}
