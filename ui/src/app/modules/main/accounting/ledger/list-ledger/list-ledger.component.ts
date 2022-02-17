import { Component, OnInit } from '@angular/core';
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
export class ListLedgerComponent implements OnInit {
  [x: string]: any;

  displayedColumns: string[] = [ 'name', 'code', 'ledgerGroup.name', 'obAmount', 'obType', 'details' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    'ledgerGroup.name': 'Ledger Group',
    obAmount: 'Opening Balance',
    obType: 'Opening Type',
    details: 'Details',

  }

    xheaders = [

    { header: 'Name', key: 'name', width: 30, },
    { header: 'Code', key: 'code', width: 15 },
    { header: 'Ledger Group', key: 'Ledger Group', width: 15 },
    { header: 'Opening Balance', key: 'Opening Balance', width: 15 },
    { header: 'Opening Type', key: 'Opening Type', width: 15 },
    { header: 'Details', key: 'Details', width: 25 }
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

  };


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterLedgerComponent, {});

  }

  ngAfterViewInit():void {

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
    let data = []
    this.ledgerService.queryData(tParams).subscribe((items) => {
      console.log();

      items.forEach((element: any) => {
        const temp = [element.name, element.code, element.ledgerGroup.name, element.obAmount, element.obType, element.details];
        data.push(temp)

    });
    const result = {
      eheader:this.xheaders,
      header:this.columnHeaders,
      rowData: data

    }
  this.mainservice.setExport(result)

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
