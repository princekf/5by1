import { Component, OnInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';
import { ActivatedRoute } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';

@Component({
  selector: 'app-list-unit',
  templateUrl: './list-unit.component.html',
  styleUrls: ['./list-unit.component.scss']
})
export class ListUnitComponent {

  displayedColumns: string[] = [ 'name', 'code', 'decimalPlaces', 'parent.name', 'times' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    decimalPlaces: 'Decimals',
    'parent.name': 'Parent',
    times: 'Times'
  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  units:ListQueryRespType<Unit> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly unitService:UnitService) { }

    private loadData = () => {

      this.loading = true;
      this.unitService.list(this.queryParams).subscribe((units) => {
  
        this.units = units;
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
