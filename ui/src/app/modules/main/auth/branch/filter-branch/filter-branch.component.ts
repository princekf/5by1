import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { FinYear } from '@shared/entity/auth/fin-year';
import { FinYearService } from '@fboservices/auth/fin-year.service';

@Component({
  selector: 'app-filter-branch',
  templateUrl: './filter-branch.component.html',
  styleUrls: [ './filter-branch.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterBranchComponent implements OnInit {

  queryParams:QueryData = { };

  defaultfinyearFiltered: Array<FinYear> = [];

  filterForm: FormGroup = new FormGroup({

    name: new FormControl(''),
    nameType: new FormControl('^'),

    email: new FormControl(''),
    emailType: new FormControl('^'),

    address: new FormControl(''),
    addressType: new FormControl('^'),

    finYearStartDate: new FormControl(''),
    finYearStartDateType: new FormControl('eq'),
    finYearStartDateStart: new FormControl(''),
    finYearStartDateEnd: new FormControl(''),


    defaultFinYearId: new FormControl(''),
    defaultFinYearIdType: new FormControl('^'),
  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private finYearService: FinYearService,) { }

    private handledefaultFinYearAutoChange = (defaultFY:string) => {

      if (typeof defaultFY !== 'string') {

        return;

      }
      this.finYearService.search({ where: {
        name: {like: defaultFY,
          options: 'i'},
      } })
        .subscribe((defaultFy) => (this.defaultfinyearFiltered = defaultFy));

    };

    ngOnInit():void {

      this.filterForm.controls.defaultFinYearId.valueChanges.subscribe(this.handledefaultFinYearAutoChange);
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
      {name: 'email',
        type: 'string'},
      {name: 'address',
        type: 'string'},
      {name: 'finYearStartDate',
        type: 'date'},
      {name: 'defaultFinYearId',
        type: 'string'},

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfdefaultFY= (idS: string): string => this.defaultfinyearFiltered.find((dfy) => dfy.id === idS)?.name;

}
