import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTaxComponent } from './list-tax/list-tax.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { DeleteTaxComponent } from './delete-tax/delete-tax.component';

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
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteTaxComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TaxRoutingModule { }
