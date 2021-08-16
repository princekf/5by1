import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ListVendorComponent } from './list-vendor/list-vendor.component';
import { VendorRoutingModule } from './vendor.routing.module';


@NgModule({
  declarations: [ CreateVendorComponent, ListVendorComponent ],
  imports: [
    CommonModule, VendorRoutingModule
  ]
})
export class VendorModule { }
