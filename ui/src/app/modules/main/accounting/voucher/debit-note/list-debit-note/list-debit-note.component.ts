import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { ExportPopupComponent } from '../../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../../services/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { handleImportVouchers } from '../../voucher.util';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-list-debit-note',
  templateUrl: './list-debit-note.component.html',
  styleUrls: [ './list-debit-note.component.scss' ]
})
export class ListDebitNoteComponent {

  voucherType = VoucherType.DEBIT_NOTE;

  tableHeader = 'List of Debit Notes';

  editUri = '/voucher/credit-note/create';
  loading = { status: false };


  constructor(private voucherService: VoucherService,
              private mainservice: MainService,
              private dialog: MatDialog) { }


    handleImportClick = (file: File): void => {

      handleImportVouchers(file, this.loading, this.voucherService);

    }

  handleExportClick = (): void => {

    this.mainservice.getExport()
    .pipe(first())
    .subscribe((data) => {

      this.dialog.open(ExportPopupComponent, {
        height: '500px',
        data: {...data, fileName : 'vouchers-debit-note'}
      });

    });

  }

}
