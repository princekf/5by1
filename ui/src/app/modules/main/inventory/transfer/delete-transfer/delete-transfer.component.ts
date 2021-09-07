import { Component, OnInit } from '@angular/core';
import { TransferService} from '@fboservices/inventory/transfer.service';
import { MainService } from '@fboservices/main.service';
import { Transfer} from '@shared/entity/inventory/transfer';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import * as dayjs from 'dayjs';
import { environment } from '@fboenvironments/environment';
@Component({
  selector: 'app-delete-transfer',
  templateUrl: './delete-transfer.component.html',
  styleUrls: [ './delete-transfer.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteTransferComponent implements OnInit {


  displayedColumns: string[] = [ 'fromAccount.name', 'toAccount.name', 'transferDate', 'amount', 'description', ];

  columnHeaders = {
    'fromAccount.name': 'From Account',
    'toAccount.name': 'To Account',
    transferDate: 'Transfer Date',
    amount: 'Amount',
    description: 'Description',

  }

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Transfer>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
     public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly transferService:TransferService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  columnParsingFn = (element:unknown, column:string): string => {


    switch (column) {

    case 'transferDate':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.transferService.listByIds(tIdArray).subscribe((transfers) => {

      this.dataSource.data = transfers;
      this.loading = false;

    });

  }

  ngAfterViewInit():void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }

  deleteTransfer(): void {

    this.loading = true;
    const transfers = this.dataSource.data;
    const tIds = [];
    transfers.forEach((transferP) => tIds.push(transferP.id));
    this.transferService.deleteByIds(tIds).subscribe((transferP) => {

      this.loading = false;
      this.toastr.success('Transfers are deleted successfully', 'Transfers deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Transfers', 'Transfer not deleted');
      console.error(error);

    });

  }


}
