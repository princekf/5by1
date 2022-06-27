import { Component, AfterViewInit, OnInit } from '@angular/core';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TaxService } from '@fboservices/inventory/tax.service';
import { Tax } from '@shared/entity/inventory/tax';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterTaxComponent } from '../filter-tax/filter-tax.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: [ './list-tax.component.scss' ],
})
export class ListTaxComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Taxes';

  displayedColumns: string[] = [ 'groupName', 'name', 'rate', 'appliedTo', 'description' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    groupName: 'Group Name',
    name: 'Name',
    rate: 'Rate (%)',
    appliedTo: 'Applied To (%)',
    description: 'Description'
  };

  xheaders = [
    {key: 'groupName',
      width: 30 },
    {key: 'name',
      width: 30 },
    { key: 'rate',
      width: 20 },
    { key: 'appliedTo',
      width: 15 },
    {key: 'description',
      width: 30 },
  ];

    iheaders = [
      'Group Name',
      'Name',
      'Rate (%)',
      'Applied To (%)',
      'Description'
    ];

  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  taxes: ListQueryRespType<Tax> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly taxService: TaxService,
    private dialog: MatDialog,
    private mainservice: MainService,) { }

  private loadData = () => {

    this.loading = true;

    this.taxService.list(this.queryParams).subscribe((taxes) => {

      this.taxes = taxes;


      this.loading = false;

    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterTaxComponent, {});

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

  handleImportClick = (file: File): void => {

    this.taxService.importTax(file).subscribe(() => {});


  }

  exportExcel() : void {

    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));

    exportAsXLSX(this.tableHeader, this.taxes.items, headers);

  }

}
