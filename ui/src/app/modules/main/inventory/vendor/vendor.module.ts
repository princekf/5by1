import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ListVendorComponent } from './list-vendor/list-vendor.component';
import { VendorRoutingModule } from './vendor.routing.module';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';


@NgModule({
  declarations: [ CreateVendorComponent, ListVendorComponent, DeleteVendorComponent ],
  imports: [
    CommonModule, VendorRoutingModule
  ]
})
export class VendorModule { }
