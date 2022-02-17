import { Component, OnInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { ActivatedRoute } from '@angular/router';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterLedgergroupComponent } from '../filter-ledgergroup/filter-ledgergroup.component';
import { MatDialog } from '@angular/material/dialog';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-ledgergroup',
  templateUrl: './list-ledgergroup.component.html',
  styleUrls: [ './list-ledgergroup.component.scss' ]
})
export class ListLedgergroupComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'code', 'parent.name', 'details' ];

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    'parent.name': 'Parent Name',
    details: 'Details'
  }
  xheaders = [

    { header: 'Name', key: 'name', width: 30, },
    { header: 'Code', key: 'code', width: 15 },
    { header: 'Parent Name', key: 'Parent Name', width: 25 },
    { header: 'Details', key: 'Details', width: 35 }
];


  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  ledgerGroups:ListQueryRespType<LedgerGroup> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute : ActivatedRoute,
    private readonly ledgergroupService:LedgergroupService,
    private dialog: MatDialog,
    private mainservice: MainService,) { }

    private loadData = () => {

      this.loading = true;

      this.queryParams.include = [
        {
          relation: 'parent',
        }
      ];
      this.ledgergroupService.list(this.queryParams).subscribe((ledgerGroup) => {

        this.ledgerGroups = ledgerGroup;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    };

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterLedgergroupComponent, {});

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
      tParams.limit = this.ledgerGroups.totalItems;
      this.loading = true;
      let data = []
      this.ledgergroupService.queryData(tParams).subscribe((items) => {

        items.forEach((element: any) => {
          console.log(element );
          element.details?element.details:''
          const temp = [element.name, element.code, element.parent?.name,element.details];

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
