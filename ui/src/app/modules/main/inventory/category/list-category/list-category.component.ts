
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '@fboservices/inventory/category.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Category } from '@shared/entity/inventory/category';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterCategoryComponent } from '../filter-category/filter-category.component';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: [ './list-category.component.scss' ]
})

export class ListCategoryComponent {

  displayedColumns: string[] = [ 'parent.name', 'name', 'unit.name', 'hsnNumber', 'description' ];

  columnHeaders = {
    'parent.name': 'Parent',
    name: 'Name',
    'unit.name': 'Unit',
    hsnNumber: 'hsnNumber',
    description: 'description',
  }
  xheaders = [
    { header: 'Parent', key: 'Parent', width: 20 },
    { header: 'Name', key: 'Name', width: 30, },
    { header: 'Unit', key:'Unit', width: 20 },
    { header: 'hsnNumber', key: 'hsnNumber', width: 20 },
    { header: 'description', key: 'description', width: 30 },

  ];

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  categories:ListQueryRespType<Category> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  constructor(private activatedRoute : ActivatedRoute,
    private categoryService:CategoryService,
    private dialog: MatDialog,
    private mainservice: MainService,) { }

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

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterCategoryComponent, {});

    }


    ngAfterViewInit():void {

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

    handleExportClick = (): void => {

      const tParams = {...this.queryParams};
      tParams.limit = this.categories.totalItems;
      this.loading = true;
      let data = []
      this.categoryService.queryData(tParams).subscribe((items) => {

        items.forEach((element: any) => {
          const temp = [element.parent?.name, element.name, element.unit?.name,element.hsnNumber,element.description];

          data.push(temp)
      });
      const result = {
        eheader:this.xheaders,
        header:this.columnHeaders,
        rowData: data
      }
    this.mainservice.setExport(result)

        this.dialog.open(ExportPopupComponent, {
          height: '500px',
          data: {items,
            displayedColumns: this.displayedColumns,
            columnHeaders: this.columnHeaders}});
        this.loading = false;


      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

}
