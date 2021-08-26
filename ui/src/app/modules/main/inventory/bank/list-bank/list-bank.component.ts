import { Component } from '@angular/core';
import { Bank } from '@shared/entity/inventory/bank';
import { BankService } from '@fboservices/inventory/bank.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: ['./list-bank.component.scss']
})
export class ListBankComponent {

  displayedColumns: string[] = ['type', 'name', 'openingBalance', 'description'];


  columnHeaders = {
    type: 'Type',
    name: 'Name',
    openingBalance: 'OpeningBalance',
    description: 'description',
  }

  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  banks: ListQueryRespType<Bank> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  constructor(private activatedRoute: ActivatedRoute,
    private bankService: BankService) { }


  ngAfterViewInit(): void {

    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };
      this.loadData();

    });


  }

  private loadData = () => {

    this.loading = true;
    this.bankService.list(this.queryParams).subscribe((banks) => {

      this.banks = banks;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  };


}
