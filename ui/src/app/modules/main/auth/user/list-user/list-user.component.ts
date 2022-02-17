import { Component, OnInit } from '@angular/core';
import { UserService } from '@fboservices/user.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterUserComponent } from '../filter-user/filter-user.component';
import { User } from '@shared/entity/auth/user';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MainService } from '../../../../../services/main.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: [ './list-user.component.scss' ]
})
export class ListUserComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'email', 'role' ];

  columnHeaders = {
    name: 'Name',
    email: 'Email',
    role: 'Role',


  };

  xheaders :any = [
    { header: 'Name', key: 'name', width: 40 },
      { header: 'Email', key: 'email', width: 50 },
      { header: 'Role', key: 'Role', width: 10 },

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

  };


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterUserComponent, {});

  }

  ngAfterViewInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      const {whereS, ...qParam} = value;
      this.queryParams = qParam;
      if (whereS) {

        this.queryParams.where = JSON.parse(whereS);

      }

      this.loadData();


    });

  }
  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.Users.totalItems;
    this.loading = true;
    let data = []
    this.userService.queryData(tParams).subscribe((items) => {

      items.forEach((element: any) => {
        const temp = [element.name, element.email, element.role];

        data.push(temp)
    });
    const result = {
      eheader:this.xheaders,
      header:this.columnHeaders,
      rowData: data
    }
  this.mainservice.setExport(result)

      this.dialog.open(ExportPopupComponent, {
        height: '500px',
        data: {items,
          displayedColumns: this.displayedColumns,
          columnHeaders: this.columnHeaders}});
      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

}
