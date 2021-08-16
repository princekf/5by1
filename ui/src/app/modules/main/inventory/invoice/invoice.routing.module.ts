import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListInvoiceComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateInvoiceComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class InvoiceRoutingModule { }
