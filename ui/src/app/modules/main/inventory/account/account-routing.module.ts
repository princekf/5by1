import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ListAccountComponent} from './list-account/list-account.component'
 import{CreateAccountComponent} from './create-account/create-account.component'

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',

    component: ListAccountComponent
  },

  {
    path: 'create',
    pathMatch: 'full',
    component:  CreateAccountComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
