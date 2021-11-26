import { Component } from '@angular/core';
import { VoucherService } from '@fboservices/accounting/voucher.service';
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

  constructor(private voucherService: VoucherService) { }

  handleImportClick = (file: File) => {
    
    this.voucherService.importVouchers(file).subscribe(() => {
      console.log('file uploaded');
      
    });
  }

}
