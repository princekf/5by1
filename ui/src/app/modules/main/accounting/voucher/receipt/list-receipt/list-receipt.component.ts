import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-receipt',
  templateUrl: './list-receipt.component.html',
  styleUrls: [ './list-receipt.component.scss' ]
})
export class ListReceiptComponent {

  voucherType = VoucherType.RECEIPT;

  tableHeader = 'List of Receipts';

  editUri = '/voucher/receipt/create';

}
