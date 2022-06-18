import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterLedgerComponent } from '../filter-ledger/filter-ledger.component';
import { Ledger } from '@shared/entity/accounting/ledger';
import { MatDialog } from '@angular/material/dialog';
import { ImportErrordataPopupComponent } from '../../../import-errordata-popup/import-errordata-popup.component';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
import flat from 'flat';

@Component({
  selector: 'app-list-ledger',
  templateUrl: './list-ledger.component.html',
  styleUrls: [ './list-ledger.component.scss' ]
})

export class ListLedgerComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = [ 'name', 'code', 'ledgerGroup.name', 'ledgerGroup.code', 'obAmount', 'obType', 'details' ];

  numberColumns: string[] = [ 'obAmount' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    'ledgerGroup.name': 'Ledger Group',
    'ledgerGroup.code': 'Group Code',
    obAmount: 'Opening Balance',
    obType: 'Opening Type',
    details: 'Details',
  };

displayedColumns1: string[] = [ 'Name', 'Code', 'OpeningBalance', 'OpeningType', 'Details' ];

  columnHeaders1 = {
    Name: 'Name',
    Code: 'Code',
    OpeningBalance: 'OpeningBalance',
    OpeningType: 'OpeningType',
    Details: 'Details',
  };


  loading = true;

  queryParams: QueryData = {};


  ledgers: ListQueryRespType<Ledger> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
              private ledgerService: LedgerService,
              private dialog: MatDialog) { }


  private loadData = () => {

    this.loading = true;

    this.queryParams.include = [ {
      relation: 'ledgerGroup'
    } ];


    this.ledgerService.list(this.queryParams).subscribe((ledger) => {


      this.ledgers = ledger;


      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterLedgerComponent, {});

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

    this.ledgerService.importLedger(file).subscribe((items) => {


      this.dialog.open(ImportErrordataPopupComponent, {height: '500px',
        data: {items,
          displayedColumns: this.displayedColumns1,
          columnHeaders: this.columnHeaders1}});

    });

  }


  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.ledgers.totalItems;
    this.loading = true;
    this.ledgerService.queryData(tParams).subscribe((items) => {

      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));
      exportAsXLSX('Ledger List', items, headers);
      this.loading = false;

    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

  columnParsingFn = (element: unknown, column: string): string => {

    const elm = flat(element);
    if (!elm[column]) {

      return ' ';

    }
    return null;

  }

}
