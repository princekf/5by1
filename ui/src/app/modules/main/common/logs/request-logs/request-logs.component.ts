import { Component, OnInit } from '@angular/core';
import { RequestLogService } from '@fboservices/common/request-log.service';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-request-logs',
  templateUrl: './request-logs.component.html',
  styleUrls: [ './request-logs.component.scss' ]
})
export class RequestLogsComponent implements OnInit {

  queryParams: QueryData = {};

  constructor(private requestLogService: RequestLogService) { }

  ngOnInit(): void {

    this.requestLogService.list(this.queryParams).subscribe((logs) => {

      console.log(logs);

    });

  }

}
