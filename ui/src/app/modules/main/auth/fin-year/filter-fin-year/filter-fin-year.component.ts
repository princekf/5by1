import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Branch } from '@shared/entity/auth/branch';
import { BranchService } from '@fboservices/auth/branch.service';

@Component({
  selector: 'app-filter-fin-year',
  templateUrl: './filter-fin-year.component.html',
  styleUrls: [ './filter-fin-year.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterFinYearComponent implements OnInit {

  queryParams:QueryData = { };

  branchFiltered: Array<Branch> = [];

  filterForm: FormGroup = new FormGroup({

    name: new FormControl(''),
    nameType: new FormControl('^'),


    startDate: new FormControl(''),
    startDateType: new FormControl('eq'),
    startDateStart: new FormControl(''),
    startDateEnd: new FormControl(''),

    endDate: new FormControl(''),
    endDateType: new FormControl('eq'),
    endDateStart: new FormControl(''),
    endDateEnd: new FormControl(''),


    branchId: new FormControl(''),
    branchIdType: new FormControl('^'),
  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private branchService: BranchService,) { }

    private handlebranchAutoChange = (branchQ:string) => {

      if (typeof branchQ !== 'string') {

        return;

      }
      this.branchService.search({ where: {
        name: {like: branchQ,
          options: 'i'},
      } })
        .subscribe((branchs) => (this.branchFiltered = branchs));

    };

    ngOnInit():void {

      this.filterForm.controls.branchId.valueChanges.subscribe(this.handlebranchAutoChange);
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
      {name: 'startDate',
        type: 'number'},
      {name: 'endDate',
        type: 'number'},
      {name: 'branchId',
        type: 'string'}


    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfbranch= (idS: string): string => this.branchFiltered.find((branch) => branch.id === idS)?.name;

}
