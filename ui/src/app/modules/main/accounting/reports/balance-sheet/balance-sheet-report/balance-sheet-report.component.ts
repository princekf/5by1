import { Component, OnInit } from '@angular/core';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';
import { FilterItem } from 'src/app/modules/main/directives/table-filter/filter-item';
import { FilterBalanceSheetReportComponent } from '../filter-balance-sheet-report/filter-balance-sheet-report.component';

@Component({
  selector: 'app-balance-sheet-report',
  templateUrl: './balance-sheet-report.component.html',
  styleUrls: [ './balance-sheet-report.component.scss' ]
})
export class BalanceSheetReportComponent implements OnInit {

  tableHeader = 'Balance Sheet Report';

  displayedColumns: string[] = [ 'lItexm', 'lAmount', 'rItem', 'rAmount' ];

  sortDisabledColumns: string[] = [ 'lItem', 'lAmount', 'rItem', 'rAmount' ];

  numberColumns: string[] = [ 'lAmount', 'rAmount' ];

  columnHeaders = {
    lItem: 'Particulars',
    lAmount: 'Amount (Dr)',
    rItem: 'Particulars',
    rAmount: 'Amount (Cr)'
  };

  loading = true;

  deleteUri: string = null;

  editUri: string = null;

  tablesRows: ListQueryRespType<BalanceSheetItem> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(private accountingReportService: AccountingReportService) { }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterBalanceSheetReportComponent, {});

    const userS = localStorage.getItem(LOCAL_USER_KEY);
    const sessionUser: SessionUser = JSON.parse(userS);
    const {finYear} = sessionUser;

    const ason = dayjs(finYear.endDate).format('YYYY-MM-DD');
    this.accountingReportService.fetchBalanceSheetItems(ason).subscribe((plItems) => {

      this.tablesRows = {
        items: [ ...plItems ],
        totalItems: plItems.length,
        pageIndex: 0
      };
      this.loading = false;

    });

  }

  exportExcel(): void {


    const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
      key: col}));

    exportAsXLSX(this.tableHeader, this.tablesRows.items, headers);


  }

  convert(): void {
  }

}
