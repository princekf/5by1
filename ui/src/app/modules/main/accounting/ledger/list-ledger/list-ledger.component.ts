import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterLedgerComponent } from '../filter-ledger/filter-ledger.component';
import { Ledger } from '@shared/entity/accounting/ledger';


@Component({
  selector: 'app-list-ledger',
  templateUrl: './list-ledger.component.html',
  styleUrls: [ './list-ledger.component.scss' ]
})
export class ListLedgerComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'ledgerGroup.name', 'refNo', 'details' ];


  columnHeaders = {
    name: 'Name',
    'ledgerGroup.name': 'Ledger Group',
    refNo: 'Reference No',
    details: 'Details',

  }

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
    private ledgerService: LedgerService) { }


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


}
