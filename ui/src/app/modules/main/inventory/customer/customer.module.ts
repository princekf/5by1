import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { CustomerRoutingModule } from './cutomer.routing.module';


@NgModule({
  declarations: [ CreateCustomerComponent, ListCustomerComponent ],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
