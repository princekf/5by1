import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '@fboservices/inventory/category.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: [ './list-category.component.scss' ]
})

export class ListCategoryComponent {

  displayedColumns: string[] = [ 'parent.name', 'name' ];

  columnHeaders = {
    'parent.name': 'Parent',
    name: 'Name',
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  categories:Array<Category> = [];


  constructor(private activatedRoute : ActivatedRoute,
    private categoryService:CategoryService) { }

    private loadData = () => {

      this.loading = true;
      this.categoryService.list(this.queryParams).subscribe((categories) => {

        this.categories = categories;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    };

    ngAfterViewInit():void {

      this.activatedRoute.queryParams.subscribe((value) => {

        this.queryParams = { ...value };
        this.loadData();

      });


    }


}
