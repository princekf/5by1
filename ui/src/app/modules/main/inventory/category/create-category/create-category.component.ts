import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@fboservices/inventory/category.service';
import { Category } from '@shared/entity/inventory/category';
import { Unit } from '@shared/entity/inventory/unit';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: [ './create-category.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateCategoryComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Categories';

  unitsFiltered: Array<Unit>;

  categoriesFiltered: Array<Category>;

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    parent: new FormControl(''),

    name: new FormControl('', [ Validators.required ]),

    unit: new FormControl('', [ Validators.required ]),

    hsnNumber: new FormControl(''),

    description: new FormControl(''),

  });


  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly unitService: UnitService,
    private readonly toastr: ToastrService) { }

    private initValueChanges = () => {

      this.form.controls.unit.valueChanges.subscribe((unitQ:unknown) => {

        if (typeof unitQ !== 'string') {

          return;

        }
        this.unitService.search({ where: {name: {like: unitQ,
          options: 'i'}} })
          .subscribe((units) => (this.unitsFiltered = units));

      });

      this.form.controls.parent.valueChanges.subscribe((categoryQ:unknown) => {

        if (typeof categoryQ !== 'string') {

          return;

        }
        this.categoryService.search({ where: {name: {like: categoryQ,
          options: 'i'}} })
          .subscribe((categories) => (this.categoriesFiltered = categories));

      });

    };

    ngOnInit(): void {

      this.initValueChanges();

      const tId = this.route.snapshot.queryParamMap.get('id');

      if (tId) {


        this.formHeader = 'Update Categories';
        this.loading = true;
        const queryParam:QueryData = {
          include: [
            {relation: 'parent'}, {relation: 'unit'}
          ]
        };
        this.categoryService.get(tId, queryParam).subscribe((categoryC) => {

          this.form.setValue({
            id: categoryC.id ?? '',
            parent: categoryC.parent ?? '',
            name: categoryC.name ?? '',
            unit: categoryC.unit ?? '',
            hsnNumber: categoryC.hsnNumber ?? '',
            description: categoryC.description ?? ''
          });

          this.loading = false;

        });

      } else {

        this.loading = false;

      }


    }

    extractNameOfObject = (obj: {name: string}): string => obj.name;

    upsertCategory(): void {


      if (!this.form.valid) {

        return;

      }
      this.loading = true;
      const categoryP = <Category> this.form.value;

      this.categoryService.upsert(categoryP).subscribe(() => {

        this.toastr.success(`Category ${categoryP.name} is saved successfully`, 'Category saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving Category ${categoryP.name}`, 'Category not saved');
        console.error(error);

      });

    }

}
