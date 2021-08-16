import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Subscription } from 'rxjs';
import { Customer } from '@shared/entity/inventory/customer';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: [ './list-customer.component.scss' ]
})
export class ListCustomerComponent {


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

  customers:ListQueryRespType<Customer> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly customerService:CustomerService) { }

    private loadData = () => {

      this.loading = true;
      this.customerService.list(this.queryParams).subscribe((customers) => {

        this.customers = customers;
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
