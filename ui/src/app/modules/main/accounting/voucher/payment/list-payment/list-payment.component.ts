
import { VoucherType } from '@shared/entity/accounting/voucher';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../../services/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { handleImportVouchers } from '../../voucher.util';
import { first } from 'rxjs/operators';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: [ './list-payment.component.scss' ]
})
export class ListPaymentComponent {


  voucherType = VoucherType.PAYMENT;

  tableHeader = 'List of Payments';

  editUri = '/voucher/payment/create';

  loading = { status: false };

  constructor(private voucherService: VoucherService,
              private mainservice: MainService,
              private dialog: MatDialog) { }

    handleImportClick = (file: File): void => {

      handleImportVouchers(file, this.loading, this.voucherService);

    }

    exportExcel(): void {

      this.mainservice.getExport()
        .pipe(first())
        .subscribe((data) => {


          const info: string[] = data.items as string[];
          const special:string[] = data.displayedColumns as string[];
          const headers = special.map((col) => ({header: data.columnHeaders[col],
            key: col}));
          exportAsXLSX(this.tableHeader, info, headers);

        });

    }

}

