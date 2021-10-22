import { Component, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { OverlayContainer } from 'ngx-toastr';

@Component({
  selector: 'app-filter-unit',
  templateUrl: './filter-unit.component.html',
  styleUrls: [ './filter-unit.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterUnitComponent {

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    nameType: new FormControl('^'),
    code: new FormControl(''),
    codeType: new FormControl('^'),
    decimalPlaces: new FormControl(''),
    decimalPlacesStart: new FormControl(''),
    decimalPlacesEnd: new FormControl(''),
    decimalPlacesType: new FormControl('eq'),
    times: new FormControl(''),
    timesType: new FormControl('eq'),
    timesStart: new FormControl(''),
    timesEnd: new FormControl(''),
  });

  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private overlayContainer: OverlayContainer) { }

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
      {name: 'code',
        type: 'string'},
      {name: 'decimalPlaces',
        type: 'number'},
      {name: 'times',
        type: 'number'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
