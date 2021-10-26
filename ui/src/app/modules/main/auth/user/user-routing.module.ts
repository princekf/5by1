import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ListUserComponent } from './list-user/list-user.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListUserComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateUserComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteUserComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule { }
