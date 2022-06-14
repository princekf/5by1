import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-bank',
  templateUrl: './filter-bank.component.html',
  styleUrls: [ './filter-bank.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterBankComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    type: new FormControl(''),
    typeType: new FormControl('^'),

    name: new FormControl(''),
    nameType: new FormControl('^'),

    openingBalance: new FormControl(''),
    openingBalanceType: new FormControl('eq'),
    openingBalanceStart: new FormControl(''),
    openingBalanceEnd: new FormControl(''),


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

      {name: 'type',
        type: 'string'},
      {name: 'name',
        type: 'string'},
      {name: 'openingBalance',
        type: 'number'}

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  resetter() {

    this.filterForm.controls.type.reset();
    this.filterForm.controls.name.reset();
    this.filterForm.controls.openingBalance.reset();

  }

}
