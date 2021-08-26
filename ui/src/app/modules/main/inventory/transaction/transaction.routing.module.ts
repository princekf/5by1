import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTransactionComponent } from './list-transaction/list-transaction.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListTransactionComponent
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TransactionRoutingModule { }
