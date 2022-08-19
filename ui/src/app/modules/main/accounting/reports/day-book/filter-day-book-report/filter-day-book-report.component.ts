import { S } from '@angular/cdk/keycodes';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCAL_USER_KEY } from '@fboutil/constants';
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

  constructor(private router:Router, private activatedRoute: ActivatedRoute,) { }

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

      dateType: new FormControl('between'),
      dateStart: new FormControl(start),
      dateEnd: new FormControl(end),
    });

  }

  ngAfterViewInit(): void {


    this.activatedRoute.queryParams.subscribe((value) => {

      const [ start, end ] = this.findStartEndDates();
      const {startDate, endDate} = value;
      this.filterForm.get('dateStart').setValue(startDate ?? start);
      this.filterForm.get('dateEnd').setValue(endDate ?? end);

    });

  }

  filterItems = ():void => {

    const sDate = dayjs(this.filterForm.get('dateStart').value).format('YYYY-MM-DD');
    const eDate = dayjs(this.filterForm.get('dateEnd').value).format('YYYY-MM-DD');
    const [ start, end ] = this.findStartEndDates();
    const startDate = sDate ?? start;
    const endDate = eDate ?? end;
    this.router.navigate([], { queryParams: {startDate,
      endDate} });

  };

  resetter = (): void => {

    const [ start, end ] = this.findStartEndDates();
    this.filterForm.controls.dateStart.setValue(start);
    this.filterForm.controls.dateEnd.setValue(end);

  }

}
