import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { ActivatedRoute } from '@angular/router';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterLedgergroupComponent } from '../filter-ledgergroup/filter-ledgergroup.component';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-ledgergroup',
  templateUrl: './list-ledgergroup.component.html',
  styleUrls: [ './list-ledgergroup.component.scss' ]
})
export class ListLedgergroupComponent implements OnInit, AfterViewInit {

  tableHeader = 'List of Ledger Groups';

  displayedColumns: string[] = [ 'name', 'code', 'parent.name', 'parent.code', 'details' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    'parent.name': 'Parent Name',
    'parent.code': 'Parent Code',
    details: 'Details',

  };

  displayedColumns1: string[] = [ 'Name', 'Code', 'Details' ];

  columnHeaders1 = {
    Name: 'Name',
    Code: 'Code',
    Details: 'Details',
  };

  queryParams: QueryData = { };


  loading = true;

  ledgerGroups: ListQueryRespType<LedgerGroup> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly ledgerGroupService: LedgerGroupService) { }

    private loadData = () => {

      this.loading = true;

      this.queryParams.include = [
        {
          relation: 'parent',
        }
      ];
      this.ledgerGroupService.list(this.queryParams).subscribe((ledgerGroup) => {

        this.ledgerGroups = ledgerGroup;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterLedgergroupComponent, {});

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
      exportAsXLSX(this.tableHeader, this.ledgerGroups.items, headers);

    }

}
