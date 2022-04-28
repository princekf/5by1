import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { ExportPopupComponent } from '../../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../../services/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { handleImportVouchers } from '../../voucher.util';

@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: [ './list-journal.component.scss' ]
})
export class ListJournalComponent {

  voucherType = VoucherType.JOURNAL;

  tableHeader = 'List of Journals';

  editUri = '/voucher/journal/create';

  displayedColumns: string[] = [ 'number', 'date', 'pledger', 'cledger', 'amount', 'details' ];


  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    pledger: 'Primary Ledger',
    cledger: 'Compound Ledger',
    amount: 'Amount',
    details: 'Details',
  };


  export: any = [];

  loading = { status: false };


  constructor(private voucherService: VoucherService,
              private mainservice: MainService,
              private dialog: MatDialog) { }


    handleImportClick = (file: File): void => {

      handleImportVouchers(file, this.loading, this.voucherService);
    }

  handleExportClick = (): void => {


    this.mainservice.getExport().subscribe((result1) => {

      this['export'] = result1;


    });


    const {items} = this['export'];
    this.dialog.open(ExportPopupComponent, {
      height: '500px',
      data: {items,
        displayedColumns: this.displayedColumns,
        columnHeaders: this.columnHeaders, }
    });

  }

}
