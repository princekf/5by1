import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-filter-day-book-report',
  templateUrl: './filter-day-book-report.component.html',
  styleUrls: [ './filter-day-book-report.component.scss' ]
})
export class FilterDayBookReportComponent implements OnInit {

  filterForm: FormGroup;

  minDate: string;

  maxDate: string;

  constructor(private router:Router) { }

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

    const [ start, end ] = this.findStartEndDates();
    this.filterForm = new FormGroup({

      date: new FormControl(''),
      dateType: new FormControl('eq'),
      dateStart: new FormControl(start),
      dateEnd: new FormControl(end),
    });

  }

  filterItems = ():void => {


    const formFields: Array<FilterFormField> = [

      {name: 'ledgerGroupId',
        type: 'string'},
      {name: 'date',
        type: 'date'}

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  resetter = (): void => {

    this.filterForm.controls.ledgerGroupId.reset();
    this.filterForm.controls.date.reset();

  }

}
