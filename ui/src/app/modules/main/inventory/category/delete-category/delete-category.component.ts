
import { Component, OnInit } from '@angular/core';
import { CategoryService} from '@fboservices/inventory/category.service';
import { MainService } from '@fboservices/main.service';
import { Category} from '@shared/entity/inventory/category';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: [ './delete-category.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteCategoryComponent implements OnInit {

  displayedColumns: string[] = [ 'parent.name', 'name', 'unit.name', 'hsnNumber', 'description' ];

  columnHeaders = {
    'parent.name': 'Parent',
    name: 'Name',
    'unit.name': 'Unit',
    hsnNumber: 'hsnNumber',
    description: 'description',
  }

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Category>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  columnParsingFn = (element:unknown, column:string): string => {

    switch (column) {

    case 'isPaid':
      return element[column] ? 'Yes' : 'No';
   

    }
    return null;

  }


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly categoryService:CategoryService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.categoryService.listByIds(tIdArray).subscribe((categories) => {

      this.dataSource.data = categories;


    });

  }

  ngAfterViewInit():void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }


  deleteCategory(): void {

    this.loading = true;
    const categories = this.dataSource.data;
    const tIds = [];
    categories.forEach((categoryP) => tIds.push(categoryP.id));
    this.categoryService.deleteByIds(tIds).subscribe((categoryP) => {

      this.loading = false;
      this.toastr.success('Categories are deleted successfully', 'Categories deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Categories', 'Category not deleted');
      console.error(error);

    });

  }


}
