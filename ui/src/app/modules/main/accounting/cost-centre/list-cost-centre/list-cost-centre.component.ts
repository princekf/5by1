import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CostCentreService } from '@fboservices/accounting/cost-centre.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterCostCentreComponent } from '../filter-cost-centre/filter-cost-centre.component';
import { CostCentre } from '@shared/entity/accounting/cost-centre';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';

@Component({
  selector: 'app-list-cost-centre',
  templateUrl: './list-cost-centre.component.html',
  styleUrls: [ './list-cost-centre.component.scss' ]
})
export class ListCostCentreComponent implements OnInit, AfterViewInit {

  tableHeader = 'List of Cost-Centres';

  displayedColumns: string[] = [ 'name', 'details' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    details: 'Details',

  };

  iheaders = [
    'Name',
    'Details',

  ];

  xheaders = [

    { key: 'name',
      width: 30, },
    { key: 'details',
      width: 30 }
  ];


  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  costCentres: ListQueryRespType<CostCentre> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
              private costCentreService: CostCentreService,
              private mainservice: MainService,
              private dialog: MatDialog) { }


  private loadData = () => {

    this.loading = true;

    this.costCentreService.list(this.queryParams).subscribe((costCentre) => {


      this.costCentres = costCentre;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterCostCentreComponent, {});

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


  exportExcel() : void {

    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));

    exportAsXLSX(this.tableHeader, this.costCentres.items, headers);

  }


}
