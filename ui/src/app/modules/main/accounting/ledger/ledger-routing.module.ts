import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateLedgerComponent } from './create-ledger/create-ledger.component';
import { DeleteLedgerComponent } from './delete-ledger/delete-ledger.component';
import { ListLedgerComponent } from './list-ledger/list-ledger.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListLedgerComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateLedgerComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteLedgerComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LedgerRoutingModule { }
