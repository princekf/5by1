import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { createQueryStringFromFilterForm, fillFilterForm, FilterFormField } from '@fboutil/filter.util';
import { RequestLog } from '@shared/entity/common/request-log';
import { QueryData } from '@shared/util/query-data';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-filter-request-logs',
  templateUrl: './filter-request-logs.component.html',
  styleUrls: [ './filter-request-logs.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterRequestLogsComponent implements OnInit {

  filterForm: FormGroup = new FormGroup({
    user: new FormControl(''),
    userType: new FormControl(''),
    branch: new FormControl(''),
    branchIdType: new FormControl(''),
    finyear: new FormControl(''),
    finyearType: new FormControl(''),
    date: new FormControl(''),
    datetype: new FormControl('')

  });

  minDate: string;

  maxDate: string;

  queryParams: QueryData = {};

  reqlogFiltered: Array<RequestLog> = []


  constructor(private router:Router,
    private activatedRoute: ActivatedRoute) { }

    private findStartEndDates = (): [Date, Date] => {

      const userS = localStorage.getItem(LOCAL_USER_KEY);
      const sessionUser: SessionUser = JSON.parse(userS);
      const {finYear} = sessionUser;
      this.minDate = dayjs(finYear.startDate).format('YYYY-MM-DD');
      this.maxDate = dayjs(finYear.endDate).format('YYYY-MM-DD');
      const end = new Date(finYear.endDate);
      const start = new Date(finYear.startDate);
      return [ start, end ];

    }

    ngOnInit(): void {

      const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
      fillFilterForm(this.filterForm, whereS);


    }

    // NgAfterViewInit():void {

    // }

    filterItems = ():void => {


      const formFields: Array<FilterFormField> = [
        {name: 'user',
          type: 'string'},
        {name: 'branch',
          type: 'string'},
        {name: 'finyear',
          type: 'number'},
        {name: 'date',
          type: 'date'},
      ];

      const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
      this.router.navigate([], { queryParams: {whereS} });

    };

    resetter():void {

      this.filterForm.controls.user.reset();
      this.filterForm.controls.branch.reset();
      this.filterForm.controls.finyear.reset();
      this.filterForm.controls.date.reset();


    }

}
