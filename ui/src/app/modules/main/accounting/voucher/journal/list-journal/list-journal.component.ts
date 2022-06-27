import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../../services/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { handleImportVouchers } from '../../voucher.util';
import { first } from 'rxjs/operators';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';

@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: [ './list-journal.component.scss' ]
})
export class ListJournalComponent {

  voucherType = VoucherType.JOURNAL;

  tableHeader = 'List of Journals';

  editUri = '/voucher/journal/create';

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
