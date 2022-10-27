import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestLogService } from '@fboservices/common/request-log.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { RequestLog } from '@shared/entity/common/request-log';
import { QueryData } from '@shared/util/query-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-request-logs',
  templateUrl: './create-request-logs.component.html',
  styleUrls: [ './create-request-logs.component.scss' ]
})
export class CreateRequestLogsComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  headers:string[]= [ 'Base Url', 'Branch', 'Email', 'Financial Year', 'Host Name', 'IP', 'Method', 'Original Url', 'Protocol', 'Path', 'Request At', 'Response At' ]

  formHeader = 'Read Ledger Group';

  loading = true;

  requestLogs: Array<RequestLog> = [];

  requestLogs$: Observable<Array<RequestLog>>;

  fboForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    baseUrl: new FormControl(''),
    branch: new FormControl(''),
    email: new FormControl(''),
    finYear: new FormControl(''),
    hostname: new FormControl(''),
    ip: new FormControl(''),
    method: new FormControl(''),
    originalUrl: new FormControl(''),
    path: new FormControl(''),
    protocol: new FormControl(''),
    reqAt: new FormControl(''),
    respAt: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly requestLogService:RequestLogService) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');


    this.requestLogService.search({}).subscribe((reqLog) => {

      this.requestLogs = reqLog;
      if (tId) {

        this.formHeader = 'Read Request Log';
        const queryParam: QueryData = {};


        this.requestLogService.get(tId, queryParam).subscribe((reqLogC) => {

          this.fboForm.setValue({id: reqLogC.id,
            baseUrl: reqLogC.baseUrl ?? '',
            branch: reqLogC.branch ?? '',
            email: reqLogC.email ?? '',
            finYear: reqLogC.finYear ?? '',
            hostname: reqLogC.hostname ?? '',
            ip: reqLogC.ip ?? '',
            method: reqLogC.method ?? '',
            path: reqLogC.path ?? '',
            originalUrl: reqLogC.originalUrl ?? '',
            protocol: reqLogC.protocol ?? '',
            reqAt: reqLogC.reqAt ?? '',
            respAt: reqLogC.respAt ?? '', });


        });
        this.loading = false;


      }

    });

  }

  get fboFormValues() {

    return Object.values(this.fboForm?.value);

  }

}
