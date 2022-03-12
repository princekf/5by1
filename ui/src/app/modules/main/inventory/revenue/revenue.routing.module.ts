import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListRevenueComponent } from './list-revenue/list-revenue.component';
import { CreateRevenueComponent } from './create-revenue/create-revenue.component';
import {DeleteRevenueComponent } from './delete-revenue/delete-revenue.component'
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListRevenueComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateRevenueComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteRevenueComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class RevenueRoutingModule { }
