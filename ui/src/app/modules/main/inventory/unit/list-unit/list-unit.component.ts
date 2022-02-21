import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';
import { ActivatedRoute } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterUnitComponent } from '../filter-unit/filter-unit.component';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-unit',
  templateUrl: './list-unit.component.html',
  styleUrls: [ './list-unit.component.scss' ]
})
export class ListUnitComponent implements  AfterViewInit, OnInit  {

  displayedColumns: string[] = [ 'name', 'code', 'decimalPlaces', 'parent.name', 'times' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    decimalPlaces: 'Decimals',
    'parent.name': 'Base Unit',
    times: 'Times'
  };
  xheaders = [
    { header: 'Name', key: 'Name', width: 30, },
    { header: 'Code', key: 'Code', width: 15 },
    { header: 'Decimals', key: 'Decimals', width: 20 },
    { header: 'Base Unit', key: 'Base Unit', width: 15 },
    { header: 'Times', key: 'Times', width: 15 }
  ];

  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  units: ListQueryRespType<Unit> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly unitService: UnitService,
    private dialog: MatDialog,
    private mainservice: MainService, ) { }

    private loadData = () => {

      this.loading = true;
      this.unitService.list(this.queryParams).subscribe((units) => {

        this.units = units;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterUnitComponent, {});

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
      tParams.limit = this.units.totalItems;
      this.loading = true;
      const data = [];
      this.unitService.queryData(tParams).subscribe((items) => {

        items.forEach((element: any) => {

          const temp = [element.name, element.code, element.decimalPlaces, element.parent?.name, element.times];

          data.push(temp);
      });
        const result = {
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
