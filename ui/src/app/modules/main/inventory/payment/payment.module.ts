import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { PaymentRoutingModule } from './payment.routing.module';
import { DeletePaymentComponent } from './delete-payment/delete-payment.component';


@NgModule({
  declarations: [ CreatePaymentComponent, ListPaymentComponent, DeletePaymentComponent ],
  imports: [
    CommonModule, PaymentRoutingModule
  ]
})
export class PaymentModule { }
