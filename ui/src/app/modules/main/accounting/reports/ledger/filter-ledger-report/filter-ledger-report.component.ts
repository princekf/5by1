import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Ledger } from '@shared/entity/accounting/ledger';
import { LedgerService } from '@fboservices/accounting/ledger.service';

@Component({
  selector: 'app-filter-ledger-report',
  templateUrl: './filter-ledger-report.component.html',
  styleUrls: [ './filter-ledger-report.component.scss', '../../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterLedgerReportComponent implements OnInit {

  ledgersFiltered: Array<Ledger> = [];

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    'transactions.ledgerId': new FormControl(''),
    'transactions.ledgerIdType': new FormControl(''),


  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private ledgerService: LedgerService) { }

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

  ngOnInit():void {


    this.filterForm.controls['transactions.ledgerId'].valueChanges.subscribe(this.handleLedgerAutoChange);

    const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
    fillFilterForm(this.filterForm, whereS);

  }

  ngAfterViewInit():void {


    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };

    });

  }

  filterItems = ():void => {


    const formFields: Array<FilterFormField> = [

      {name: 'transactions.ledgerId',
        type: 'string'},

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfObject = (idS: string): string => this.ledgersFiltered.find((ldgr) => ldgr.id === idS)?.name;

}
