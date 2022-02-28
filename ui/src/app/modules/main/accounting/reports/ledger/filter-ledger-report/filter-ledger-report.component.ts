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

@Component({
  selector: 'app-filter-ledger-report',
  templateUrl: './filter-ledger-report.component.html',
  styleUrls: [ './filter-ledger-report.component.scss', '../../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterLedgerReportComponent implements OnInit {

  ledgersFiltered: Array<Ledger> = [];

  queryParams: QueryData = { };

  filterForm: FormGroup;

  minDate: string;

  maxDate: string;


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private ledgerService: LedgerService) { }

  private handleLedgerAutoChange = (ledgerQ: unknown) => {

    if (typeof ledgerQ !== 'string') {

      return;

    }
    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
    } })
      .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

  }

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

      'transactions.ledgerId': new FormControl(''),
      'transactions.ledgerIdType': new FormControl(''),
      date: new FormControl(''),
      dateType: new FormControl('eq'),
      dateStart: new FormControl(start),
      dateEnd: new FormControl(end),
    });
    this.filterForm.controls['transactions.ledgerId'].valueChanges.subscribe(this.handleLedgerAutoChange);
    const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
    const where: Record<string, Record<string, unknown>> = JSON.parse(whereS);
    if (where['transactions.ledgerId'] && where['transactions.ledgerId'].like) {

      const cldgId = where['transactions.ledgerId'].like as string;
      this.ledgerService.get(cldgId, {}).subscribe((ldgr) => {

        this.ledgersFiltered.push(ldgr);
        this.filterForm.controls['transactions.ledgerId'].setValue(ldgr.id);

      });

    }
    fillFilterForm(this.filterForm, whereS);

  }


  ngAfterViewInit(): void {


    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };

    });

  }

  filterItems = (): void => {


    const formFields: Array<FilterFormField> = [

      {name: 'transactions.ledgerId',
        type: 'string'},
      {name: 'date',
        type: 'date'}

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  }

  extractNameOfObject = (idS: string): string => this.ledgersFiltered.find((ldgr) => ldgr.id === idS)?.name;

}
