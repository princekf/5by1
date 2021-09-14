import { Component, OnInit } from '@angular/core';
import { ProductService} from '@fboservices/inventory/product.service';
import { MainService } from '@fboservices/main.service';
import { Product} from '@shared/entity/inventory/product';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: [ './delete-product.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteProductComponent implements OnInit {


  displayedColumns: string[] = [ 'name', 'code', 'brand', 'location', 'barcode', 'reorderLevel', 'category.name', 'status' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    brand: 'Brand',
    location: 'Location',
    barcode: 'Barcode',
    reorderLevel: 'Re-Order',
    'category.name': 'Category',
    status: 'Status'
  }


  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Product>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly productService:ProductService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      include: [
        {relation: 'category'}
      ],
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.productService.search(queryData).subscribe((units) => {

      this.dataSource.data = units;
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


  deleteProduct(): void {

    this.loading = true;
    const products = this.dataSource.data;
    const tIds = [];
    products.forEach((productP) => tIds.push(productP.id));
    const where = {id: {
      inq: tIds
    }};
    this.productService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count} products are deleted successfully`, 'Products deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Products', 'Product not deleted');
      console.error(error);

    });

  }

}

