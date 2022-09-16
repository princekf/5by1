import { Component, OnInit } from '@angular/core';
import { AccountingReportService } from '@fboservices/accounting/accounting-report.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { SessionUser } from '@shared/util/session-user';
import * as dayjs from 'dayjs';
import { FilterItem } from 'src/app/modules/main/directives/table-filter/filter-item';
import { FilterProfitLossReportComponent } from '../filter-profit-loss-report/filter-profit-loss-report.component';

@Component({
  selector: 'app-profit-loss-report',
  templateUrl: './profit-loss-report.component.html',
  styleUrls: [ './profit-loss-report.component.scss' ]
})
export class ProfitLossReportComponent implements OnInit {

  tableHeader = 'Profit and Loss Report';

  displayedColumns: string[] = [ 'lItem', 'lAmount', 'rItem', 'rAmount' ];

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

    this.filterItem = new FilterItem(FilterProfitLossReportComponent, {});

    const userS = localStorage.getItem(LOCAL_USER_KEY);
    const sessionUser: SessionUser = JSON.parse(userS);
    const {finYear} = sessionUser;

    const startDate = dayjs(finYear.startDate).format('YYYY-MM-DD');
    const endDate = dayjs(finYear.endDate).format('YYYY-MM-DD');
    this.accountingReportService.fetchPLReportItems(startDate, endDate).subscribe((plItems) => {

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
