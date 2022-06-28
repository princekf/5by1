import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { MainService } from '../../../../../../services/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { handleImportVouchers } from '../../voucher.util';
import { first } from 'rxjs/operators';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-receipt',
  templateUrl: './list-receipt.component.html',
  styleUrls: [ './list-receipt.component.scss' ]
})
export class ListReceiptComponent {

  voucherType = VoucherType.RECEIPT;

  tableHeader = 'List of Receipts';

  editUri = '/voucher/receipt/create';

  loading = { status: false };


  constructor(private voucherService: VoucherService,
              private mainservice: MainService) { }


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
