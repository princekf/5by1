import { Component, OnInit } from '@angular/core';
import { MainService } from '@fboservices/main.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';

import { Ledger } from '@shared/entity/accounting/ledger';
import { LedgerService } from '@fboservices/accounting/ledger.service';

@Component({
  selector: 'app-delete-ledger',
  templateUrl: './delete-ledger.component.html',
  styleUrls: [ './delete-ledger.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteLedgerComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'ledgerGroup.name', 'obAmount', 'obType', 'details' ];


  columnHeaders = {
    name: 'Name',
    'ledgerGroup.name': 'Ledger Group',
    obAmount: 'Opening Balance',
    obType: 'Opening Type',
    details: 'Details',

  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Ledger>([]);

  findColumnValue = _findColumnValue;


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly ledgerService: LedgerService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      include: [
        {relation: 'ledgerGroup'}
      ],
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.ledgerService.search(queryData).subscribe((ledger) => {

      this.dataSource.data = ledger;
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

  deleteLedgers(): void {

    this.loading = true;
    const ledgers = this.dataSource.data;
    const tIds = [];
    ledgers.forEach((ledgerP) => tIds.push(ledgerP.id));
    const where = {id: {
      inq: tIds
    }};

    this.ledgerService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Ledgers are deleted successfully`, 'Ledgers deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Ledgers', 'Ledger not deleted');
      console.error(error);

    });

  }


}
