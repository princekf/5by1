import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CostCentreService } from '@fboservices/accounting/cost-centre.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterCostCentreComponent } from '../filter-cost-centre/filter-cost-centre.component';
import { CostCentre } from '@shared/entity/accounting/cost-centre';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-cost-centre',
  templateUrl: './list-cost-centre.component.html',
  styleUrls: [ './list-cost-centre.component.scss' ]
})
export class ListCostCentreComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = [ 'name', 'details' ];


  columnHeaders = {
    name: 'Name',
    details: 'Details',

  };
    xheaders = [
     'Name',
    'Details',

    ];
  whheaders = [

    {  width: 30, },
    { width: 30 }
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

  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.costCentres.totalItems;
    this.loading = true;
    const data = [];
    this.costCentreService.queryData(tParams).subscribe((items) => {
      console.log();

      items.forEach((element: any) => {
        const temp = [element.name, element.details];
        data.push(temp);
    });
      const result = {
          wheader: this.whheaders,
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
