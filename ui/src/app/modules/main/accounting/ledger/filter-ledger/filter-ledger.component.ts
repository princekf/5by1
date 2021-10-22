import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-ledger',
  templateUrl: './filter-ledger.component.html',
  styleUrls: [ './filter-ledger.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterLedgerComponent implements OnInit {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    nameType: new FormControl('^'),

    refNo: new FormControl(''),
    refNoType: new FormControl('^'),

    ledgerGroup: new FormControl(''),
    ledgerGroupType: new FormControl('eq'),

  });

  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,) { }

  ngOnInit():void {

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
      {name: 'name',
        type: 'string'},
      {name: 'refNo',
        type: 'string'},
      {name: 'ledgerGroup',
        type: 'string'},

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
