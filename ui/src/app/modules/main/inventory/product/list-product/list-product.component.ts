import { Component, AfterViewInit, OnInit  } from '@angular/core';
import { ProductService } from '@fboservices/inventory/product.service';
import { Product } from '@shared/entity/inventory/product';
import { ActivatedRoute } from '@angular/router';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterProductComponent } from '../filter-product/filter-product.component';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-item',
  templateUrl: './list-product.component.html',
  styleUrls: [ './list-product.component.scss' ]
})
export class ListProductComponent implements AfterViewInit, OnInit  {

  displayedColumns: string[] = [ 'name', 'code', 'brand', 'location', 'barcode', 'reorderLevel', 'category.name', 'status' ];
  c = this.displayedColumns.length;
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
  xheaders = [
    {key: 'name' , width: 30 },
    {key: 'code' , width: 15 },
    {key: 'brand' ,  width: 20 },
    {key: 'location' , width: 15 },
    {key: 'barcode' , width: 20 },
    {key: 'reorderLevel' ,  width: 20 },
    {key: 'category.name' , width: 25 },
    {key: 'status' ,  width: 35 }

  ];
   iheaders = [
     'Name',
     'Code',
     'Brand',
     'Location',
     'Barcode',
     'Re-Order',
     'Category',
     'Status'
   ];


  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  rawDatas: ListQueryRespType<Product> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private dialog: MatDialog,
    private mainservice: MainService, ) { }

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

    handleExportClick = (): void => {

      const tParams = {...this.queryParams};
      tParams.limit = this.rawDatas.totalItems;
      this.loading = true;
      const data = [];
      this.productService.queryData(tParams).subscribe((items) => {

        items.forEach((element: any) => {
          const temp = [element.name, element.code, element.brand, element.location, element.barcode, element.reorderLevel,
            element.category?.name, element.status];

          data.push(temp);
      });
        const result = {
          cell: this.c,
          rheader: this.iheaders,
        eheader: this.xheaders,
        header: this.columnHeaders,
        rowData: data
      };
        this.mainservice.setExport(result);

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
