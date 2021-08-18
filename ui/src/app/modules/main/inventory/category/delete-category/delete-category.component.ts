import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CategoryService} from '@fboservices/inventory/category.service';
import { MainService } from '@fboservices/main.service';
import { Category} from '@shared/entity/inventory/category';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: [ './delete-category.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeleteCategoryComponent implements OnInit {

  displayedColumns: string[] = [ 'parent', 'name' ];

  columnHeaders = {
    parent: 'Parent',
    name: 'Name',
  }

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Category>([]);


  loading = true;


  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly categoryService:CategoryService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.categoryService.listByIds(tIdArray).subscribe((categories) => {

      this.dataSource.data = categories;

      console.log(this.dataSource);
      this.loading = false;

    });

  }

  ngAfterViewInit():void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

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

  deleteCategory(): void {

    this.loading = true;
    const units = this.dataSource.data;
    const tIds = [];
    units.forEach((taxP) => tIds.push(taxP._id));
    this.categoryService.deleteByIds(tIds).subscribe((categoryP) => {

      this.loading = false;
      this.toastr.success('Categories are deleted successfully', 'Categories deleted');
      this.goToCategory();

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Categories', 'Category not deleted');
      console.error(error);

    });

  }

  findColumnValue = (element:unknown, column:string):string => <string>column.split('.').reduce((acc, cur) => acc[cur], element);

}
