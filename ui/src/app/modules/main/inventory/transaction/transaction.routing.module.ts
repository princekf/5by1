import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListTransactionComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateTransactionComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TransactionRoutingModule { }
