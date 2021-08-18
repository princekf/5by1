import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CategoryService} from '@fboservices/inventory/category.service';
import { Category } from '@shared/entity/inventory/category';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
interface Parent {
  viewValue: string;
}
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: [ './create-category.component.scss' ]
})
export class CreateCategoryComponent implements OnInit {


  loading = false;

  private name: string[] = [];

  nameOptions: Observable<string[]>;

  categories: Array<Category> = [];


  form: FormGroup = new FormGroup({

    parent: new FormControl('', [ Validators.required ]),

    name: new FormControl('', [ Validators.required ]),

    sdate: new FormControl('', [ Validators.required ]),

    edate: new FormControl('', [ Validators.required ]),

  });

  parent: Parent[] = [
    {viewValue: 'p1'},
    {viewValue: 'P2'},
    {viewValue: 'p3'}
  ];

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.name.filter((option) => option.toLowerCase().includes(filterValue));

  }

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly categoryService:CategoryService,
    private readonly toastr: ToastrService) { }


  ngOnInit(): void {

    this.nameOptions = this.form.controls.name.valueChanges.pipe(
      startWith(''), map((value) => this._filter(value))
    );

    this.categoryService.getname().subscribe((name) => {

      this.name = name;

    });

  }

  goToCategory(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/category' ], {queryParams: uParams});

  }


  upsertCategory(): void {

    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const categoryP = <Category> this.form.value;
    // eslint-disable-next-line max-len
    (categoryP._id ? this.categoryService.update(categoryP) : this.categoryService.save(categoryP)).subscribe((categoryC) => {

      this.toastr.success(`Category ${categoryC.name} is saved successfully`, 'Category saved');
      this.goToCategory();

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Category ${categoryP.name}`, 'Category not saved');
      console.error(error);

    });

  }

}
