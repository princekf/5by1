import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-list-contra',
  templateUrl: './list-contra.component.html',
  styleUrls: [ './list-contra.component.scss' ]
})
export class ListContraComponent {

  voucherType = VoucherType.CONTRA;

  tableHeader = 'List of Contras';

  editUri = '/voucher/contra/create';

}
