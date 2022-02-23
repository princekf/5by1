import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BranchService } from '@fboservices/auth/branch.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterBranchComponent } from '../filter-branch/filter-branch.component';
import { Branch } from '@shared/entity/auth/branch';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
  styleUrls: [ './list-branch.component.scss' ]
})
export class ListBranchComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [ 'name', 'email', 'code', 'address', 'finYearStartDate', 'defaultFinYear.name' ];
  c = this.displayedColumns.length;
  columnHeaders = {
    name: 'Name',
    email: 'Email',
    code: 'Code',
    address: 'Address',
    finYearStartDate: 'FinYearStartDate',
    'defaultFinYear.name': 'DefaultFinYear'
  };
  xheaders = [
    {key: 'name' , width: 30, },
    {key: 'email' , width: 40 },
    {key: 'code' ,  width: 15 },
    { key: 'address' , width: 50 },
    {key: 'finYearStartDate' ,  width: 19 },
    {key: 'defaultFinYear.name' , width: 15 }
  ];

   iheaders = [
    'Name',
     'Email',
     'Code',
     'Address',
     'FinYearStartDate',
    'DefaultFinYear'
   ];

  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  branchs: ListQueryRespType<Branch> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {


    case 'finYearStartDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(private activatedRoute: ActivatedRoute,
              private branchService: BranchService,
              private dialog: MatDialog,
              private mainservice: MainService, ) { }


  private loadData = () => {

    this.loading = true;

    this.queryParams.include = [ {
      relation: 'defaultFinYear'
    } ];
    this.branchService.list(this.queryParams).subscribe((branch) => {


      this.branchs = branch;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterBranchComponent, {});

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

  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.branchs.totalItems;
    this.loading = true;
    const data = [];
    this.branchService.queryData(tParams).subscribe((items) => {

      items.forEach((element: any) => {
        const temp = [element.name, element.email, element.code, element.address, element.finYearStartDate];

        data.push(temp);
    });
      const result = {
        cell:this.c,
          rheader: this.iheaders,
      eheader: this.xheaders,
      header: this.columnHeaders,
      rowData: data
    };
      this.mainservice.setExport(result);

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
