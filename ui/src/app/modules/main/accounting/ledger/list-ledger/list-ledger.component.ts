import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterLedgerComponent } from '../filter-ledger/filter-ledger.component';
import { Ledger } from '@shared/entity/accounting/ledger';
import { MatDialog } from '@angular/material/dialog';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MainService } from '../../../../../services/main.service';

@Component({
  selector: 'app-list-ledger',
  templateUrl: './list-ledger.component.html',
  styleUrls: [ './list-ledger.component.scss' ]
})
// tslint:disable-next-line: whitespace
export class ListLedgerComponent implements OnInit,AfterViewInit {
  [x: string]: any;

  displayedColumns: string[] = [ 'name', 'code', 'ledgerGroup.name', 'obAmount', 'obType', 'details' ];
  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    'ledgerGroup.name': 'Ledger Group',
    obAmount: 'Opening Balance',
    obType: 'Opening Type',
    details: 'Details',
  };
  xheaders = [

    {key: 'name', width: 30, },
    { key: 'code', width: 15 },
    {key: 'ledgerGroup.name', width: 15 },
    { key: 'obAmount', width: 15 },
    { key: 'obType', width: 15 },
    { key: 'details' , width: 25 }
    ];
   iheaders = [
    'Name',
   'Code',
    'Ledger Group',
    'Opening Balance',
    'Opening Type',
     'Details',
   ];




  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  ledgers: ListQueryRespType<Ledger> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
              private ledgerService: LedgerService,
              private mainservice: MainService,
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


  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.ledgers.totalItems;
    this.loading = true;
    const data = [];
    this.ledgerService.queryData(tParams).subscribe((items) => {

      items.forEach((element: any) => {
        const temp = [element.name, element.code, element.ledgerGroup.name, element.obAmount, element.obType, element.details];
        data.push(temp);

    });


      this.dialog.open(ExportPopupComponent, {
        height: '500px',
        data: {items,
          displayedColumns: this.displayedColumns,
          columnHeaders: this.columnHeaders}});
      this.loading = false;
      const result = {
        cell: this.c,
          rheader: this.iheaders,
        eheader: this.xheaders,
        header: this.columnHeaders,
        rowData: data

      };
      this.mainservice.setExport(result);
    }
    , (error) => {

      console.error(error);
      this.loading = false;

    });

  }

}
