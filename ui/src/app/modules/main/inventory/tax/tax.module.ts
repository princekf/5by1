import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { ListTaxComponent } from './list-tax/list-tax.component';
import { TaxRoutingModule } from './tax.routing.module';


@NgModule({
  declarations: [ CreateTaxComponent, ListTaxComponent ],
  imports: [
    CommonModule,
    TaxRoutingModule
  ]
})
export class TaxModule { }
