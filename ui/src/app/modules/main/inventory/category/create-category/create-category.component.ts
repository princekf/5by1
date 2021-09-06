import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@fboservices/inventory/category.service';
import { Category } from '@shared/entity/inventory/category';
import { Unit } from '@shared/entity/inventory/unit';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: [ './create-category.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateCategoryComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Categories';

  private name: string[] = [];

  categories: Array<Category> = [];

  units: Array<Unit> = [];

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    parent: new FormControl('', [ Validators.required ]),

    name: new FormControl('', [ Validators.required ]),

    unit: new FormControl('', [ Validators.required ]),

    hsnNumber: new FormControl('', [ Validators.required ]),

    description: new FormControl('', [ Validators.required ]),

  });


  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly unitService: UnitService,
    private readonly toastr: ToastrService) { }


  ngOnInit(): void {


    const tId = this.route.snapshot.queryParamMap.get('id');

    this.unitService.listAll().subscribe((units) => {

      this.units = units;

    });
    this.categoryService.listAll().subscribe((categories) => {

      this.categories = categories;
      this.loading = false;
      if (tId) {


        this.formHeader = 'Update Categories';
        this.loading = true;
        this.categoryService.get(tId).subscribe((categoryC) => {

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

    });


  }


  upsertCategory(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const categoryP = <Category> this.form.value;


    // eslint-disable-next-line max-len
    (categoryP.id ? this.categoryService.update(categoryP) : this.categoryService.save(categoryP)).subscribe((categoryC) => {

      this.toastr.success(`Category ${categoryC.name} is saved successfully`, 'Category saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Category ${categoryP.name}`, 'Category not saved');
      console.error(error);

    });

  }

}