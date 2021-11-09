import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: [ './list-sales.component.scss' ]
})
export class ListSalesComponent {

  voucherType = VoucherType.SALES;

  tableHeader = 'List of Purchases';

  editUri = '/voucher/sales/create';

}
