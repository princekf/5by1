import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';


@NgModule({
  declarations: [ CreatePaymentComponent, ListPaymentComponent ],
  imports: [
    CommonModule, ToolBarModule, VoucherTemplateModule, DataTableModule, PaymentRoutingModule
  ]
})
export class PaymentModule { }
