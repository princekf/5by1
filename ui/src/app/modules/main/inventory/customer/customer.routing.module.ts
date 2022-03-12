import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListCustomerComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateCustomerComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteCustomerComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class CustomerRoutingModule { }
