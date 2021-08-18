import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '@fboservices/inventory/category.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: [ './list-category.component.scss' ]
})

export class ListCategoryComponent {

  displayedColumns: string[] = [ 'parent', 'name' ];

  columnHeaders = {
    parent: 'Parent',
    name: 'Name',
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  dataSource = new MatTableDataSource<Category>([]);

  categories:ListQueryRespType<Category> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  constructor(private activatedRoute : ActivatedRoute,
    private categoryService:CategoryService) { }

    private loadData = () => {

      this.loading = true;
      this.categoryService.list(this.queryParams).subscribe((categories) => {

        this.categories = categories;

        this.loading = false;

        console.log(this.categories);

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
