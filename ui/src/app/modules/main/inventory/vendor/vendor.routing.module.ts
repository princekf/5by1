import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListVendorComponent } from './list-vendor/list-vendor.component';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListVendorComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateVendorComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteVendorComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class VendorRoutingModule { }
