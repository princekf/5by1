import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: [ './list-journal.component.scss' ]
})
export class ListJournalComponent {

  voucherType = VoucherType.JOURNAL;

  tableHeader = 'List of Journals';

  editUri = '/voucher/journal/create';

}
