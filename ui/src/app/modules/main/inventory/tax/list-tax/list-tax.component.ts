import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Tax } from '@shared/entity/inventory/tax';
import { QueryData } from '@shared/util/query-data';
import { MainService } from '@fboservices/main.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_SIZE_OPTIONS } from '@fboutil/constants';
import { TaxService } from '@fboservices/inventory/tax.service';

@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: [ './list-tax.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListTaxComponent {

  expandedElement: Tax | null;

  displayedColumns: string[] = [ 'groupName', 'name', 'rate', 'appliedTo', 'description' ];

  columnHeaders = {
    groupName: 'Group Name',
    name: 'Name',
    rate: 'Rate (%)',
    appliedTo: 'Applied To (%)',
    description: 'Description'
  }

  extraColumns: string[] = [ ];

  dataSource = new MatTableDataSource<Tax>([]);

  pageSizeOptions:Array<number> = PAGE_SIZE_OPTIONS;

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;


  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private readonly mainService: MainService,
    private readonly taxService:TaxService) { }

  private loadData = () => {

    this.loading = true;
    this.taxService.list(this.queryParams).subscribe((taxes) => {

      this.dataSource.data = taxes;
      this.loading = false;

    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  };

  ngAfterViewInit():void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }
    this.sort.sortChange.subscribe((cSort:Sort) => {

      this.queryParams.sortc = cSort.active;
      this.queryParams.sortd = cSort.direction;
      this.router.navigate([], { queryParams: this.queryParams });

    });
    this.subscribeParamChange();
    this.queryParams = {...this.activatedRoute.snapshot.queryParams};
    this.loadData();

  }

  private subscribeParamChange = () => {

    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = {
        start: value.start ?? 0,
        limit: value.limit ?? this.pageSizeOptions[0],
        sortc: value.sortc ? value.sortc : null,
        sortd: value.sortd ? value.sortd : null,
        qrs: value.qrs ?? null,
      };
      this.loadData();

    });

  };

}
