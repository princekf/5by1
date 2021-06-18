import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListItemComponent } from './list-item/list-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
 
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
   
    component: ListItemComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateItemComponent
  },

   
   
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ItemRoutingModule { }
