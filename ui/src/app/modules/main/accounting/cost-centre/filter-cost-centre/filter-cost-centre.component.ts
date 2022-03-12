import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';


@Component({
  selector: 'app-filter-cost-centre',
  templateUrl: './filter-cost-centre.component.html',
  styleUrls: [ './filter-cost-centre.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterCostCentreComponent implements OnInit, AfterViewInit {

  queryParams: QueryData = { };

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    nameType: new FormControl('^'),

    details: new FormControl(''),
    detailsType: new FormControl('^'),


  });

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute, ) { }

  ngOnInit(): void {

    const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
    fillFilterForm(this.filterForm, whereS);

  }

  ngAfterViewInit(): void {


    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };

    });

  }

  filterItems = (): void => {


    const formFields: Array<FilterFormField> = [
      {name: 'name',
        type: 'string'},
      {name: 'details',
        type: 'string'},

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  }


}
