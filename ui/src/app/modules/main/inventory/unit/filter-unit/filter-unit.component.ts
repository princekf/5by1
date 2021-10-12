import { Component, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-filter-unit',
  templateUrl: './filter-unit.component.html',
  styleUrls: [ './filter-unit.component.scss' ]
})
export class FilterUnitComponent {

  selectedtwo = 'one';

  selectedthree = 'one';

  selectedfour = 'one';

  queryParams:QueryData = { };

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    nameType: new FormControl('^'),
    code: new FormControl(''),
    codeType: new FormControl('^'),
  });

  constructor(private router:Router,
    private activatedRoute : ActivatedRoute) { }

  ngAfterViewInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };

    });

  }

  filterItems = ():void => {

    const whereAnds:Array<unknown> = [];
    if (this.filterForm.controls.name.value) {

      whereAnds.push(
        {name: {like: `${this.filterForm.controls.nameType.value}${this.filterForm.controls.name.value}`,
          options: 'i'}}
      );

    }
    if (this.filterForm.controls.code.value) {

      whereAnds.push(
        {code: {like: `${this.filterForm.controls.codeType.value}${this.filterForm.controls.code.value}`,
          options: 'i'}}
      );

    }
    this.router.navigate([], { queryParams: {whereS: JSON.stringify({and: whereAnds})} });

  };

}
