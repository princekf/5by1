import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FinYearService } from '@fboservices/auth//fin-year.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterFinYearComponent } from '../filter-fin-year/filter-fin-year.component';
import { FinYear } from '@shared/entity/auth/fin-year';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-fin-year',
  templateUrl: './list-fin-year.component.html',
  styleUrls: [ './list-fin-year.component.scss' ]
})
export class ListFinYearComponent implements OnInit, AfterViewInit {

  tableHeader = 'List of Fin Years';

  displayedColumns: string[] = [ 'name', 'code', 'startDate', 'endDate', 'branch.name' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    startDate: 'StartDate',
    endDate: 'EndDate',
    'branch.name': 'Branch',

  };

  xheaders = [

    { key: 'name',
      width: 30, },
    { key: 'code',
      width: 15 },
    {key: 'startDate',
      width: 15 },
    {key: 'endDate',
      width: 15 },
    {key: 'branch.name',
      width: 25 },

  ];

   iheaders = [
     'Name',
     'Code',
     'StartDate',
     'EndDate',
     'Branch',

   ];


  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  FinYears: ListQueryRespType<FinYear> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {


    case 'startDate':
      return dayjs(element[column]).format(environment.dateFormat);

    case 'endDate':
      return dayjs(element[column]).format(environment.dateFormat);


    }
    return null;

  }

  constructor(private activatedRoute: ActivatedRoute,
              private finYearService: FinYearService,
              private dialog: MatDialog,
              private mainservice: MainService,) { }


  private loadData = () => {

    this.loading = true;

    this.queryParams.include = [ {
      relation: 'branch'
    } ];
    this.finYearService.list(this.queryParams).subscribe((finyear) => {


      this.FinYears = finyear;


      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterFinYearComponent, {});

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

    exportAsXLSX(this.tableHeader, this.FinYears.items, headers);

  }

}
