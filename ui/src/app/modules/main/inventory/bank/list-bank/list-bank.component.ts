import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Bank } from '@shared/entity/inventory/bank';
import { BankService } from '@fboservices/inventory/bank.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterBankComponent } from '../filter-bank/filter-bank.component';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: [ './list-bank.component.scss' ]
})
export class ListBankComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [ 'type', 'name', 'openingBalance', 'description' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    type: 'Type',
    name: 'Name',
    openingBalance: 'OpeningBalance',
    description: 'description',
  };

  iheaders = [
    'Type',
    'Name',
    'OpeningBalance',
    'description',
  ];

  xheaders = [
    {key: 'type',
      width: 15 },
    {key: 'name',
      width: 30, },
    {key: 'openingBalance',
      width: 20 },
    {key: 'description',
      width: 25 }
  ];


  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  banks: ListQueryRespType<Bank> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  constructor(private activatedRoute: ActivatedRoute,
              private bankService: BankService,
              private dialog: MatDialog,
              private mainservice: MainService,) { }


  private loadData = () => {

    this.loading = true;
    this.bankService.list(this.queryParams).subscribe((banks) => {

      this.banks = banks;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterBankComponent, {});

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
    tParams.limit = this.banks.totalItems;
    this.loading = true;
    const data = [];
    this.bankService.queryData(tParams).subscribe((items) => {

      items.forEach((element) => {

        const temp = [ element.type, element.name, element.openingBalance, element.description, ];

        data.push(temp);

      });
      const result = {
        cell: this.c,
        rheader: this.iheaders,
        eheader: this.xheaders,
        header: this.columnHeaders,
        rowData: data
      };
      this.mainservice.setExport(result);

      this.dialog.open(ExportPopupComponent, {height: '500px',
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
