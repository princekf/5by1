import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTransferComponent } from './list-transfer/list-transfer.component';
import { CreateTransferComponent } from './create-transfer/create-transfer.component';
import { DeleteTransferComponent } from './delete-transfer/delete-transfer.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListTransferComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateTransferComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteTransferComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TransferRoutingModule { }
