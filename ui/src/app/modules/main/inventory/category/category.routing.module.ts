import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCategoryComponent } from './list-category/list-category.component';
import { CreateCategoryComponent } from './create-category/create-category.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListCategoryComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateCategoryComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class CategoryRoutingModule { }
