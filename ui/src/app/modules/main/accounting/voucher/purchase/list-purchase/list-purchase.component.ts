import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-purchase',
  templateUrl: './list-purchase.component.html',
  styleUrls: [ './list-purchase.component.scss' ]
})
export class ListPurchaseComponent {

  voucherType = VoucherType.PURCHASE;

  tableHeader = 'List of Purchases';

  editUri = '/voucher/purchase/create';

}
