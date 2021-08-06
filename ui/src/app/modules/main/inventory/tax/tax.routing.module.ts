import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTaxComponent } from './list-tax/list-tax.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListTaxComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateTaxComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TaxRoutingModule { }
