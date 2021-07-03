import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListTranferComponent} from './list-tranfer/list-tranfer.component'
import{CreateTranferComponent} from './create-tranfer/create-tranfer.component'
const routes: Routes = [


  {
    path: '',
    pathMatch: 'full',

    component:  ListTranferComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component:   CreateTranferComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranferRoutingModule { }
