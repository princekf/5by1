import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
  styleUrls: [ './list-branch.component.scss' ]
})
export class ListBranchComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'email', 'code', 'address', 'finYearStartDate', 'defaultFinYear.name' ];


  columnHeaders = {
    name: 'Name',
    email: 'Email',
    code: 'Code',
    address: 'Address',
    finYearStartDate: 'FinYearStartDate',
    'defaultFinYear.name': 'DefaultFinYear'
  }

  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  branchs: ListQueryRespType<Branch> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {


    case 'finYearStartDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  constructor(private activatedRoute: ActivatedRoute,
    private branchService: BranchService) { }


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

  };


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterBranchComponent, {});

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


}
