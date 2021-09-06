import { Component, OnInit } from '@angular/core';
import { BankService } from '@fboservices/inventory/bank.service';
import { MainService } from '@fboservices/main.service';
import { Bank } from '@shared/entity/inventory/bank';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-delete-bank',
  templateUrl: './delete-bank.component.html',
  styleUrls: [ './delete-bank.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteBankComponent implements OnInit {

  displayedColumns: string[] = [ 'type', 'name', 'openingBalance', 'description' ];


  columnHeaders = {
    type: 'Type',
    name: 'Name',
    openingBalance: 'OpeningBalance',
    description: 'description',
  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Bank>([]);

  findColumnValue = _findColumnValue;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly bankService: BankService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    this.bankService.listByIds(tIdArray).subscribe((banks) => {

      this.dataSource.data = banks;
      this.loading = false;

    });

  }

  ngAfterViewInit(): void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }

  deleteBanks(): void {

    this.loading = true;
    const categories = this.dataSource.data;
    const tIds = [];
    categories.forEach((bankP) => tIds.push(bankP.id));
    this.bankService.deleteByIds(tIds).subscribe((bankP) => {

      this.loading = false;
      this.toastr.success('Banks are deleted successfully', 'Banks deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Banks', 'Bank not deleted');
      console.error(error);

    });

  }

}
