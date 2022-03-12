import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { ListBillComponent } from './list-bill/list-bill.component';
import { DeleteBillComponent } from './delete-bill/delete-bill.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListBillComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateBillComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteBillComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class BillRoutingModule { }
