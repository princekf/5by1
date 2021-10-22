import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { DeleteTransactionComponent } from './delete-transaction/delete-transaction.component';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';

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
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteTransactionComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TransactionRoutingModule { }
