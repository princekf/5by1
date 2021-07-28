import { Component } from '@angular/core';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TaxService } from '@fboservices/inventory/tax.service';
import { Tax } from '@shared/entity/inventory/tax';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: [ './list-tax.component.scss' ],
})
export class ListTaxComponent {


  displayedColumns: string[] = [ 'groupName', 'name', 'rate', 'appliedTo', 'description' ];

  columnHeaders = {
    groupName: 'Group Name',
    name: 'Name',
    rate: 'Rate (%)',
    appliedTo: 'Applied To (%)',
    description: 'Description'
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  taxes:ListQueryRespType<Tax> = {
    totalItems: 0,
    items: []
  };

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly taxService:TaxService) { }

  private loadData = () => {

    this.loading = true;
    this.taxService.list(this.queryParams).subscribe((taxes) => {

      this.taxes = taxes;
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
