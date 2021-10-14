import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterVendorComponent } from '../filter-vendor/filter-vendor.component';

@Component({
  selector: 'app-list-vendor',
  templateUrl: './list-vendor.component.html',
  styleUrls: [ './list-vendor.component.scss' ]
})
export class ListVendorComponent {

  displayedColumns: string[] = [ 'name', 'email', 'mobile', 'state', 'address', 'gstNo' ];

  columnHeaders = {
    name: 'Name',
    email: 'E-Mail',
    mobile: 'Mobile',
    state: 'State',
    address: 'Address',
    gstNo: 'GST No'
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  rawDatas:ListQueryRespType<Customer> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly vendorService:VendorService) { }

    private loadData = () => {

      this.loading = true;
      this.vendorService.list(this.queryParams).subscribe((rawDatas) => {

        this.rawDatas = rawDatas;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    };

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterVendorComponent, {});

    }


    ngAfterViewInit():void {

      this.activatedRoute.queryParams.subscribe((value) => {

        const {whereS, ...qParam} = value;
        this.queryParams = qParam;
        if (whereS) {

          this.queryParams.where = JSON.parse(whereS);

        }

        this.loadData();


      });

    }

}
