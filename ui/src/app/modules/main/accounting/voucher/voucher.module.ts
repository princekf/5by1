import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoucherRoutingModule } from './voucher-routing.module';
import { ListVoucherComponent } from './list-voucher/list-voucher.component';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { DeleteVoucherComponent } from './delete-voucher/delete-voucher.component';
import { FilterVoucherComponent } from './filter-voucher/filter-voucher.component';


@NgModule({
  declarations: [ ListVoucherComponent, CreateVoucherComponent, DeleteVoucherComponent, FilterVoucherComponent ],
  imports: [
    CommonModule,
    VoucherRoutingModule
  ]
})
export class VoucherModule { }
