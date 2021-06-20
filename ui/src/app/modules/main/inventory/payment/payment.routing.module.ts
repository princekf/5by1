import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPaymentComponent } from './list-payment/list-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListPaymentComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreatePaymentComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PaymentRoutingModule { }
