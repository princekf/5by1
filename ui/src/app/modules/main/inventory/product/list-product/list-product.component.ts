import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ProductService } from '@fboservices/inventory/product.service';
import { Product } from '@shared/entity/inventory/product';
import { ActivatedRoute } from '@angular/router';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterProductComponent } from '../filter-product/filter-product.component';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-item',
  templateUrl: './list-product.component.html',
  styleUrls: [ './list-product.component.scss' ]
})
export class ListProductComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Products';

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
  };

  queryParams: QueryData = { };

  loading = true;

  rawDatas: ListQueryRespType<Product> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly productService: ProductService) { }

    private loadData = () => {

      this.loading = true;
      this.queryParams.include = [
        {relation: 'category'}
      ];
      this.productService.list(this.queryParams).subscribe((rawDatas) => {

        this.rawDatas = rawDatas;


        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterProductComponent, {});

    }

    ngAfterViewInit(): void {

      this.activatedRoute.queryParams.subscribe((value) => {

        const {whereS, ...qParam} = value;
        this.queryParams = qParam;
        if (whereS) {

          this.queryParams.where = JSON.parse(whereS);

        }

        this.loadData();


      });

    }

    handleImportClick = (file: File): void => {

      this.productService.importProduct(file).subscribe();


    }

    exportExcel(): void {


      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.rawDatas.items, headers);


    }

}
