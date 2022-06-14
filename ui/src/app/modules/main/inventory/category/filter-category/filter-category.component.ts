import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { Category } from '@shared/entity/inventory/category';
import { CategoryService } from '@fboservices/inventory/category.service';
import { Unit } from '@shared/entity/inventory/unit';
import { UnitService } from '@fboservices/inventory/unit.service';

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: [ './filter-category.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterCategoryComponent {

  queryParams:QueryData = { };

  parentFiltered: Array<Category> = [];

  unitFiltered: Array<Unit> = [];

  filterForm: FormGroup = new FormGroup({
    parentId: new FormControl(''),
    parentIdType: new FormControl('^'),
    name: new FormControl(''),
    nameType: new FormControl('^'),

    unitId: new FormControl(''),
    unitIdType: new FormControl('^'),


    hsnNumber: new FormControl(''),
    hsnNumberType: new FormControl('^'),

  });


  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private categoryService: CategoryService,
    private unitService: UnitService,) { }

    private handleparentAutoChange = (parentQ:string) => {

      if (typeof parentQ !== 'string') {

        return;

      }
      this.categoryService.search({ where: {
        name: {like: parentQ,
          options: 'i'},
      } })
        .subscribe((parents) => (this.parentFiltered = parents));

    };

    private handleunitAutoChange = (unitQ:string) => {

      if (typeof unitQ !== 'string') {

        return;

      }
      this.unitService.search({ where: {
        name: {like: unitQ,
          options: 'i'},
      } })
        .subscribe((units) => (this.unitFiltered = units));

    };

    ngOnInit():void {

      this.filterForm.controls.parentId.valueChanges.subscribe(this.handleparentAutoChange);
      this.filterForm.controls.unitId.valueChanges.subscribe(this.handleunitAutoChange);
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
      {name: 'parentId',
        type: 'string'},
      {name: 'name',
        type: 'string'},
      {name: 'unitId',
        type: 'string'},
      {name: 'hsnNumber',
        type: 'string'}
    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfparent= (idS: string): string => this.parentFiltered.find((prt) => prt.id === idS)?.name;

  extractNameOfunit= (idS: string): string => this.unitFiltered.find((unit) => unit.id === idS)?.name;

  resetter() {

    this.filterForm.controls.parentId.reset();
    this.filterForm.controls.name.reset();
    this.filterForm.controls.unitId.reset();
    this.filterForm.controls.hsnNumber.reset();

  }

}
