import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListProductComponent } from './list-product/list-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListProductComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateProductComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteProductComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ProductRoutingModule { }
