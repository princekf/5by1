import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListBranchComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateBranchComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteBranchComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BranchRoutingModule { }
