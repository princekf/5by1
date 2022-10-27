import { Component, OnInit } from '@angular/core';
import { environment } from '@fboenvironments/environment';
import { RequestLogService } from '@fboservices/common/request-log.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { RequestLog } from '@shared/entity/common/request-log';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import { FilterRequestLogsComponent } from '../filter-request-logs/filter-request-logs.component';
import { FilterItem } from '../../../directives/table-filter/filter-item';

@Component({
  selector: 'app-request-logs',
  templateUrl: './request-logs.component.html',
  styleUrls: [ './request-logs.component.scss' ]
})
export class RequestLogsComponent implements OnInit {

  displayedColumns: string[] = [ 'email', 'branch', 'finYear', 'reqAt', 'path', 'method' ];

  columnHeaders = {

    email: 'User',
    branch: 'Branch',
    finYear: 'Fin Year',
    reqAt: 'Date',
    path: 'Path',
    method: 'Method'
  };

  loading = false;

  reqLog: ListQueryRespType<RequestLog> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  queryParams: QueryData = {};

  filterItem: FilterItem;


  constructor(private requestLogService: RequestLogService) { }

  columnParsingFn = (element: unknown, column: string): string => {

    switch (column) {

    case 'reqAt':

      return `${dayjs(element[column]).format(environment.dateFormat)} ${dayjs(element[column]).format('LT')}`;

    }
    return null;

  }

  ngOnInit(): void {


    this.filterItem = new FilterItem(FilterRequestLogsComponent, {});


    this.requestLogService.list(this.queryParams).subscribe((logs) => {

      this.reqLog = logs;


    });

  }

}
