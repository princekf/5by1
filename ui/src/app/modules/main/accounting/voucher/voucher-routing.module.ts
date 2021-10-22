import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { DeleteVoucherComponent } from './delete-voucher/delete-voucher.component';
import { ListVoucherComponent } from './list-voucher/list-voucher.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListVoucherComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateVoucherComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteVoucherComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class VoucherRoutingModule { }
