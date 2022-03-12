import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateLedgergroupComponent } from './create-ledgergroup/create-ledgergroup.component';
import { DeleteLedgergroupComponent } from './delete-ledgergroup/delete-ledgergroup.component';
import { ListLedgergroupComponent } from './list-ledgergroup/list-ledgergroup.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListLedgergroupComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateLedgergroupComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteLedgergroupComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LedgergroupRoutingModule { }
