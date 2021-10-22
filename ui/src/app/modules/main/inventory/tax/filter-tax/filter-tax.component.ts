import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';

@Component({
  selector: 'app-filter-tax',
  templateUrl: './filter-tax.component.html',
  styleUrls: [ './filter-tax.component.scss', '../../../../../util/styles/fbo-filter-style.scss']
})
export class FilterTaxComponent {


  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    groupName: new FormControl(''),
    groupNameType: new FormControl('^'),
    name: new FormControl(''),
    nameType: new FormControl('^'),

    rate: new FormControl(''),
    rateType: new FormControl('eq'),
    rateStart: new FormControl(''),
    rateEnd: new FormControl(''),

    appliedTo: new FormControl(''),
    appliedToType: new FormControl('eq'),
    appliedToStart: new FormControl(''),
    appliedToEnd: new FormControl(''),
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
      {name: 'groupName',
        type: 'string'},
      {name: 'name',
        type: 'string'},
      {name: 'rate',
        type: 'number'},
      {name: 'appliedTo',
        type: 'number'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };


}
