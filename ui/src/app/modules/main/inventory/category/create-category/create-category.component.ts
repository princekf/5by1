import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

import { CategoryService} from '@fboservices/inventory/category.service';
import { Category } from '@shared/entity/inventory/category';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: [ './create-category.component.scss' ]
})
export class CreateCategoryComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = false;

  private name: string[] = [];

  nameOptions: Observable<string[]>;

  categories: Array<Category> = [];


  form: FormGroup = new FormGroup({

    parent: new FormControl('', [ Validators.required ]),

    name: new FormControl('', [ Validators.required ]),

    unit: new FormControl('', [ Validators.required ]),

    hsnNumber: new FormControl('', [ Validators.required ]),

    description: new FormControl('', [ Validators.required ]),

  });


  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.name.filter((option) => option.toLowerCase().includes(filterValue));

  }

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly categoryService:CategoryService,
    private readonly toastr: ToastrService) { }


  ngOnInit(): void {


    const tId = this.route.snapshot.queryParamMap.get('id');
    this.loading = true;
    this.categoryService.listAll().subscribe((categories) => {

      this.categories = categories;
      if (tId) {

        this.categoryService.get(tId).subscribe((categoryC) => {

          this.form.setValue({_id: categoryC._id,
            naparentme: categoryC.parent,
            name: categoryC.name,
            unit: categoryC.unit ?? '',
            hsnNumber: categoryC.hsnNumber ?? '',
            description: categoryC.description ?? ''});

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
    (categoryP._id ? this.categoryService.update(categoryP) : this.categoryService.save(categoryP)).subscribe((categoryC) => {

      this.toastr.success(`Unit ${categoryC.name} is saved successfully`, 'Unit saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving unit ${categoryP.name}`, 'Unit not saved');
      console.error(error);

    });

  }

}
