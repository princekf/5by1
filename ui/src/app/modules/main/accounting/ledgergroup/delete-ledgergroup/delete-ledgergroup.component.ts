import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { MainService } from '@fboservices/main.service';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-delete-ledgergroup',
  templateUrl: './delete-ledgergroup.component.html',
  styleUrls: [ './delete-ledgergroup.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteLedgergroupComponent implements OnInit {


  goToPreviousPage = _goToPreviousPage;

  displayedColumns: string[] = [ 'name', 'parent.name', 'details' ];

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<LedgerGroup>([]);

  columnHeaders = {
    name: 'Name',
    'parent.name': 'Parent Name ',
    details: 'Details',
  }

  loading = true;

  findColumnValue = _findColumnValue;

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly ledgergroupService:LedgergroupService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      where: {
        id: {
          inq: tIdArray
        }
      }
    };

    queryData.include = [
      {
        relation: 'parent',
      }
    ];
    this.ledgergroupService.search(queryData).subscribe((ledgerGroups) => {

      this.dataSource.data = ledgerGroups;
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

  deleteLedgerGroups(): void {

    this.loading = true;
    const ledgerGroups = this.dataSource.data;
    const tIds = [];
    ledgerGroups.forEach((taxP) => tIds.push(taxP.id));

    const where = {id: {
      inq: tIds
    }};

    this.ledgergroupService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Ledger Groups are deleted successfully`, 'Ledger Group deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting ledgerGroups', 'ledgerGroup not deleted');
      console.error(error);

    });

  }

}
