import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPaymentComponent } from './list-payment/list-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { DeletePaymentComponent } from './delete-payment/delete-payment.component';

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
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeletePaymentComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PaymentRoutingModule { }
