import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { ExportPopupComponent } from '../../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '@fboservices/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { handleImportVouchers } from '../../voucher.util';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-list-contra',
  templateUrl: './list-contra.component.html',
  styleUrls: ['./list-contra.component.scss']
})
export class ListContraComponent {

  voucherType = VoucherType.CONTRA;

  loading = { status: false };

  tableHeader = 'List of Contras';

  editUri = '/voucher/contra/create';

  displayedColumns: string[] = ['number', 'date', 'pledger', 'cledger', 'amount', 'details'];

  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    pledger: 'Primary Ledger',
    cledger: 'Compound Ledger',
    amount: 'Amount',
    details: 'Details',
  };


  constructor(private voucherService: VoucherService,
    private mainservice: MainService,
    private dialog: MatDialog) { }


  handleImportClick = (file: File): void => {

    handleImportVouchers(file, this.loading, this.voucherService);

  }

  handleExportClick = (): void => {

    this.mainservice.getExport()
    .pipe(first())
    .subscribe((resData) => {

      const {items} = resData;
      this.dialog.open(ExportPopupComponent, {
        height: '500px',
        data: {
          items,
          displayedColumns: this.displayedColumns,
          columnHeaders: this.columnHeaders,
  
        }
      });

    });

  }

}
