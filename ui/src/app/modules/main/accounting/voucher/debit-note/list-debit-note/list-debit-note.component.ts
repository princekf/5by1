import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-debit-note',
  templateUrl: './list-debit-note.component.html',
  styleUrls: [ './list-debit-note.component.scss' ]
})
export class ListDebitNoteComponent {

  voucherType = VoucherType.DEBIT_NOTE;

  tableHeader = 'List of Debit Notes';

  editUri = '/voucher/credit-note/create';

}
