import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: [ './list-payment.component.scss' ]
})
export class ListPaymentComponent {

  voucherType = VoucherType.PAYMENT;

  tableHeader = 'List of Payments';

  editUri = '/voucher/payment/create';

}
