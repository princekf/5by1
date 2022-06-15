import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Ledger } from '@shared/entity/accounting/ledger';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';

@Component({
  selector: 'app-filter-ledger-group-report',
  templateUrl: './filter-ledger-group-report.component.html',
  styleUrls: [ './filter-ledger-group-report.component.scss', '../../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterLedgerGroupReportComponent implements OnInit {

  ledgersFiltered: Array<Ledger> = [];

  ledgerGroupsFiltered: Array<LedgerGroup> = [];

  queryParams:QueryData = { };

  filterForm: FormGroup;

  minDate: string;

  maxDate: string;


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private ledgerService: LedgerService,
    private ledgergroupService: LedgerGroupService) { }

    private handleLedgerGroupAutoChange = (ledgerGQ:unknown) => {

      if (typeof ledgerGQ !== 'string') {

        return;

      }
      this.ledgergroupService.search({ where: {
        name: {like: ledgerGQ,
          options: 'i'},
      } })
        .subscribe((ledgerGs) => (this.ledgerGroupsFiltered = ledgerGs));

    };

  private handleLedgerAutoChange = (ledgerQ:unknown) => {

    if (typeof ledgerQ !== 'string') {

      return;

    }
    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
    } })
      .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

  };

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

  ngOnInit():void {

    const [ start, end ] = this.findStartEndDates();
    this.filterForm = new FormGroup({

      ledgerGroupId: new FormControl(''),
      ledgerGroupIdType: new FormControl(''),
      againstL: new FormControl(''),
      againstLType: new FormControl('ne'),
      date: new FormControl(''),
      dateType: new FormControl('eq'),
      dateStart: new FormControl(start),
      dateEnd: new FormControl(end),
    });
    this.filterForm.controls.ledgerGroupId.valueChanges.subscribe(this.handleLedgerGroupAutoChange);
    this.filterForm.controls.againstL.valueChanges.subscribe(this.handleLedgerAutoChange);
    const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
    const where:Record<string, Record<string, unknown>> = JSON.parse(whereS);
    if (where?.ledgerGroupId && where?.ledgerGroupId.like) {

      const cldgId = where.ledgerGroupId.like as string;
      const againstLId = where.againstL?.ne as string;

      this.ledgergroupService.queryData({where: {'_id': {in: [ cldgId ]}}}).subscribe((ledgerGs) => {

        this.ledgerGroupsFiltered.push(...ledgerGs);
        this.filterForm.controls.ledgerGroupId.setValue(cldgId);

      });

      this.ledgerService.queryData({where: {'_id': {in: [ againstLId ]}}}).subscribe((ledgers) => {

        this.ledgersFiltered.push(...ledgers);
        this.filterForm.controls.againstL.setValue(againstLId);

      });

    }
    fillFilterForm(this.filterForm, whereS);

  }

  ngAfterViewInit():void {


    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };

    });

  }

  filterItems = ():void => {


    const formFields: Array<FilterFormField> = [

      {name: 'ledgerGroupId',
        type: 'string'},
      {name: 'againstL',
        type: 'void'},
      {name: 'date',
        type: 'date'}

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfObject = (idS: string): string => this.ledgersFiltered.find((ldgr) => ldgr.id === idS)?.name;

  extractNameOfLedgerGroup = (idS: string): string => this.ledgerGroupsFiltered.find((ldgr) => ldgr.id === idS)?.name;

  resetter = (): void => {

    this.filterForm.controls.ledgerGroupId.reset();
    this.filterForm.controls.againstL.reset();
    this.filterForm.controls.date.reset();

  }

}
