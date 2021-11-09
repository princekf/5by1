import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-credit-note',
  templateUrl: './list-credit-note.component.html',
  styleUrls: [ './list-credit-note.component.scss' ]
})
export class ListCreditNoteComponent {

  voucherType = VoucherType.CREDIT_NOTE;

  tableHeader = 'List of Credit Notes';

  editUri = '/voucher/credit-note/create';

}
