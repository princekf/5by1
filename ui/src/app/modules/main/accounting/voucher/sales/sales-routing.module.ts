import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { ListSalesComponent } from './list-sales/list-sales.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListSalesComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateSalesComponent
  },
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SalesRoutingModule { }
