
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '@fboservices/inventory/category.service';
import { QueryData } from '@shared/util/query-data';
import { Category } from '@shared/entity/inventory/category';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterCategoryComponent } from '../filter-category/filter-category.component';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: [ './list-category.component.scss' ]
})

export class ListCategoryComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Categories';

  displayedColumns: string[] = [ 'parent.name', 'name', 'unit.name', 'hsnNumber', 'description' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    'parent.name': 'Parent',
    name: 'Name',
    'unit.name': 'Unit',
    hsnNumber: 'hsnNumber',
    description: 'Description',
  };

  queryParams: QueryData = { };

  loading = true;

  categories: ListQueryRespType<Category> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
              private categoryService: CategoryService) { }

    private loadData = () => {

      this.loading = true;

      this.categoryService.list(this.queryParams).subscribe((categories) => {

        this.categories = categories;

        this.loading = false;


      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterCategoryComponent, {});

    }


    ngAfterViewInit(): void {

      this.activatedRoute.queryParams.subscribe((value) => {


        const {whereS, ...qParam} = value;

        this.queryParams = {...qParam,
          include: [ {relation: 'parent'}, {relation: 'unit'} ] };
        if (whereS) {

          this.queryParams.where = JSON.parse(whereS);

        }

        this.loadData();

      });


    }

    handleImportClick = (file: File): void => {

      this.categoryService.importCategory(file).subscribe();


    }

    exportExcel() : void {

      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.categories.items, headers);

    }


}
