import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CustomerRoutingModule } from './customer.routing.module';


@NgModule({
  declarations: [ ListCustomerComponent, CreateCustomerComponent ],
  imports: [
    CommonModule, CustomerRoutingModule
  ]
})
export class CustomerModule { }
