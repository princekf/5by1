import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-transfer',
  templateUrl: './filter-transfer.component.html',
  styleUrls: [ './filter-transfer.component.scss' ]
})
export class FilterTransferComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({

    fromAccount: new FormControl(''),
    fromAccountType: new FormControl('^'),

    toAccount: new FormControl(''),
    toAccountType: new FormControl('^'),

    transferDate: new FormControl(''),
    transferDateType: new FormControl('eq'),
    transferDateStart: new FormControl(''),
    transferDateEnd: new FormControl(''),

    amount: new FormControl(''),
    amountType: new FormControl('eq'),
    amountStart: new FormControl(''),
    amountEnd: new FormControl(''),


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

      {name: 'fromAccount',
        type: 'string'},
      {name: 'toAccount',
        type: 'string'},
      {name: 'transferDate',
        type: 'number'},
      {name: 'amount',
        type: 'number'}


    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
