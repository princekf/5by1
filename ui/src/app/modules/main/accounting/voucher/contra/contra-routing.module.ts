import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateContraComponent } from './create-contra/create-contra.component';
import { ListContraComponent } from './list-contra/list-contra.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListContraComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateContraComponent
  },
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ContraRoutingModule { }
