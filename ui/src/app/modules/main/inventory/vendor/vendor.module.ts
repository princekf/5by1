import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListVendorComponent } from './list-vendor/list-vendor.component';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { VendorRoutingModule } from './vendor.routing.module';


@NgModule({
  declarations: [ ListVendorComponent, CreateVendorComponent ],
  imports: [
    CommonModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
