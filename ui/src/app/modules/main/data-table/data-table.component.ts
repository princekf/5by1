import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { PAGE_SIZE_OPTIONS } from '@fboutil/constants';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: [ './data-table.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableComponent {

  @Input() tableHeader: string;

  @Input() displayedColumns: Array<string>;

  @Input() columnHeaders: Record<string, string>;

  private _tableData:ListQueryRespType<unknown>;

  totalItems:number;

  @Input()
  get tableData(): ListQueryRespType<unknown> {

    return this._tableData;

  }

  set tableData(tableData: ListQueryRespType<unknown>) {

    this._tableData = tableData;
    this.dataSource.data = tableData.items;
    this.totalItems = tableData.totalItems;

  }

  @Input() loading:boolean;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<unknown>([]);

  pageSizeOptions:Array<number> = PAGE_SIZE_OPTIONS;

  expandedElement: unknown | null;

  queryParams:QueryData = { };

  constructor(private router:Router,
    private readonly mainService: MainService) { }

  ngAfterViewInit():void {

    // eslint-disable-next-line no-underscore-dangle
    this.paginator._intl.itemsPerPageLabel = 'Rows per page';
    if (this.mainService.isMobileView()) {

      // eslint-disable-next-line no-underscore-dangle
      this.paginator._intl.itemsPerPageLabel = '';
      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }
    this.paginator.page.subscribe((evt: PageEvent) => {

      this.queryParams.limit = evt.pageSize;
      this.queryParams.start = evt.pageIndex * evt.pageSize;
      this.router.navigate([], { queryParams: this.queryParams });

    });
    this.sort.sortChange.subscribe((cSort:Sort) => {

      this.queryParams.sortc = cSort.active;
      this.queryParams.sortd = cSort.direction;
      this.router.navigate([], { queryParams: this.queryParams });

    });

  }

  findColumnValue = (element:unknown, column:string):string => <string>column.split('.').reduce((acc, cur) => acc[cur], element);

}
