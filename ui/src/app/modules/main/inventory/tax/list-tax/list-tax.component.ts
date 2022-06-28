import { Component, AfterViewInit, OnInit } from '@angular/core';
import { QueryData } from '@shared/util/query-data';
import { ActivatedRoute } from '@angular/router';
import { TaxService } from '@fboservices/inventory/tax.service';
import { Tax } from '@shared/entity/inventory/tax';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterTaxComponent } from '../filter-tax/filter-tax.component';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: [ './list-tax.component.scss' ],
})
export class ListTaxComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Taxes';

  displayedColumns: string[] = [ 'groupName', 'name', 'rate', 'appliedTo', 'description' ];

  columnHeaders = {
    groupName: 'Group Name',
    name: 'Name',
    rate: 'Rate (%)',
    appliedTo: 'Applied To (%)',
    description: 'Description'
  };

  queryParams: QueryData = { };

  loading = true;

  taxes: ListQueryRespType<Tax> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly taxService: TaxService) { }

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

    this.taxService.importTax(file).subscribe();


  }

  exportExcel() : void {

    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));

    exportAsXLSX(this.tableHeader, this.taxes.items, headers);

  }

}
