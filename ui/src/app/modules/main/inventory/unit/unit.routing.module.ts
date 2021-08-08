import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUnitComponent } from './list-unit/list-unit.component';
import { CreateUnitComponent } from './create-unit/create-unit.component';
import { DeleteUnitComponent } from './delete-unit/delete-unit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListUnitComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateUnitComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteUnitComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class UnitRoutingModule { }
