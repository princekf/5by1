import { Component} from '@angular/core';
import { TransferService } from '@fboservices/inventory/transfer.service';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Transfer } from '@shared/entity/inventory/transfer';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-transfer',
  templateUrl: './list-transfer.component.html',
  styleUrls: [ './list-transfer.component.scss' ]
})
export class ListTransferComponent {


  displayedColumns: string[] = [ 'fromAccount.name', 'toAccount.name', 'transferDate', 'amount', 'description', ];

  columnHeaders = {
    'fromAccount.name': 'From Account',
    'toAccount.name': 'To Account',
    transferDate: 'Transfer Date',
    amount: 'Amount',
    description: 'Description',

  }

  queryParams:QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  transfers:ListQueryRespType<Transfer> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  constructor(
    private transferService : TransferService,
    private activatedRoute : ActivatedRoute
  ) { }


  private loadData = () => {

    this.loading = true;
    this.transferService.list(this.queryParams).subscribe((transfers) => {

      this.transfers = transfers;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  };

  ngAfterViewInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = { ...value };
      this.loadData();

    });


  }

}
