import { Component } from '@angular/core';
import { ProductService } from '@fboservices/inventory/product.service';
import { Product } from '@shared/entity/inventory/product';
import { ActivatedRoute } from '@angular/router';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-product.component.html',
  styleUrls: [ './list-product.component.scss' ]
})
export class ListProductComponent {

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

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  rawDatas:ListQueryRespType<Product> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly productService:ProductService) { }

    private loadData = () => {

      this.loading = true;
      this.productService.list(this.queryParams).subscribe((rawDatas) => {

        this.rawDatas = rawDatas;
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
